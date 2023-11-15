import express from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import { ToWords } from 'to-words';
import invoicePdf from "markup-invoice-pdf";
import path,{dirname} from "path";
import { fileURLToPath } from 'url';
// import open from 'open';

// const urlToOpen = "http://localhost:3000/";
const app = express();
const port = 3000;
const db = new sqlite3.Database('party_names.db');
let pdfFile = "C:/vilas/Om Ice Cubes-Billing/public/" + "/invoice.pdf";
let htmlFile = "finalTest.html";
const __dirname = dirname(fileURLToPath(import.meta.url));

// open(urlToOpen)
//   .then(() => {
//     console.log(`Opened ${urlToOpen} in the default web browser.`);
//   })
//   .catch((err) => {
//     console.error(`Error opening ${urlToOpen}: ${err.message}`);
//   });


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("index");
});

app.get("/exit", (req, res) => {
    process.exit(0);
})

app.post('/print', (req, res) => {
    db.serialize(() => {
        db.all('SELECT * FROM party_names WHERE party_name=?', [req.body.party], async (err, rows) => {
            if (err) {
                throw err;
            }
            const party_names = rows;
            let amount = req.body.rate * req.body.quantity;
            let tax = amount * 0.025;
            let fakeTax;
            if (tax % 1 == 0) {
                fakeTax = amount * 0.025 + ".00";
            } else {
                fakeTax = amount * 0.025;
            }
            let total = parseFloat((amount + tax + tax).toFixed(2));


            //date
            const today = new Date();
            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1;
            let dd = today.getDate();
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            const formattedToday = dd + '/' + mm + '/' + yyyy;

            //number-to-words
            const toWords = new ToWords();
            let words = toWords.convert(total, { currency: true });

            //current month
            const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const d = new Date();
            let currentMonth = month[d.getMonth()];


            db.run(`INSERT INTO PRINTED_BILLS_BACKUP(date_added,party_name,gst,amount,tax,total,month)
VALUES(?,?,?,?,?,?,?)`, [formattedToday, req.body.party, party_names[0].gst, amount, fakeTax, total, currentMonth]);

            await invoicePdf(htmlFile, pdfFile, {
                name: req.body.party,
                address: party_names[0].address,
                gst: party_names[0].gst,
                quantity: req.body.quantity,
                packOrKg: req.body.packOrKg,
                rate: req.body.rate,
                amount: amount,
                tax: fakeTax,
                total: total,
                date: formattedToday,
                words: words
            })
                .then(function (fileUrl) {
                    res.render("printPreview");
                })
                .catch(function (err) {
                    throw err;
                });



        });
    });

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});