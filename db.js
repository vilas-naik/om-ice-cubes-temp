import sqlite3 from "sqlite3";
const db = new sqlite3.Database('party_names.db');

db.serialize(() => {

    db.all(`DELETE FROM printed_bills WHERE id=906`, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Success.');
        }
    });
});
db.close();

