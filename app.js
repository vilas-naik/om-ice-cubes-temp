import express from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import { ToWords } from 'to-words';
import invoicePdf from "markup-invoice-pdf";
import open from 'open';

const urlToOpen = "http://localhost:3000/";
const app = express();
const port = 3000;
const db = new sqlite3.Database('party_names.db');
const htmlFile = "finalTest.html";
let pdfFile = "public/" + "/invoice.pdf";
let invoice;

open(urlToOpen)
    .then(() => {
        console.log(`Opened ${urlToOpen} in the default web browser.`);
    })
    .catch((err) => {
        console.error(`Error opening ${urlToOpen}: ${err.message}`);
    });


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("index");
});

app.get("/exit", (req, res) => {
    db.close();
    process.exit(0);
})


app.post('/print', (req, res) => {
    db.serialize(() => {
        db.all(`
    SELECT * FROM party_names WHERE party_name=?;
`, [req.body.party], (err, rows) => {
            if (err) {
                throw err;
                res.redirect("/");
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



            db.all(`SELECT id 
            FROM    printed_bills
            WHERE   id = (SELECT MAX(id)  FROM printed_bills);`, async (err, rows) => {
                if (err) {
                    throw err;
                }
                invoice = rows[0].id;

               try {
                db.run(`INSERT INTO printed_bills(id,dateAdded,party_name,gst,amount,tax,total,month)
                VALUES(?,?,?,?,?,?,?,?)`, [++invoice, formattedToday, req.body.party, party_names[0].gst, amount, fakeTax*2, total, currentMonth]);
    
                    await invoicePdf(htmlFile, pdfFile, {
                        id: invoice,
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
                    });
                    res.render("printPreview");
                
               } catch (error) {
                res.redirect("/");
               }



        });
    });
});
});

// SELECT id FROM printed_bills WHERE id = (SELECT MAX(id) FROM printed_bills);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});