import express from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";


const app = express();
const port = 3000;
const db = new sqlite3.Database('party_names.db');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    db.serialize(() => {
        db.all('SELECT party_name FROM party_names', (err, rows) => {
            if (err) {
                throw err;
            }
            const party_names = rows;


            res.render('index.ejs', { party_names: party_names }); // Pass party_names to the rendering engine
            // db.close((err) => {
            //     if (err) {
            //         return console.error(err.message);
            //     }
            //     console.log('Closed the database connection.');
            // });
        });
    });
});

app.post('/print', (req, res) => {
    db.serialize(() => {
        db.all('SELECT * FROM party_names where party_name=?', [req.body.party], (err, rows) => {
            if (err) {
                throw err;
            }
            console.log(rows);

            const date = new Date();

            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            // This arrangement can be altered based on how we want the date's format to appear.
            let currentDate = `${day}-${month}-${year}`;
            let total = req.body.quantity*req.body.rate;
            res.render('bill.ejs', {
                party_name: req.body.party,
                address: rows[0].address,
                gst: rows[0].gst,
                date: currentDate,
                quantity:req.body.quantity,
                rate:req.body.rate,
                total:total,
                packOrKg:req.body.packOrKg
            }); // Pass party_names to the rendering engine

        });
    });
});

// Close the database connection after all operations
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Close the database connection outside of the app.listen callback

