import sqlite3 from "sqlite3";
const db = new sqlite3.Database('party_names.db');

db.serialize(() => {

    db.all(`ALTER TABLE printed_bills
ADD bill_pdf BLOB;`, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Success.');
        }
    });
});
db.close();

