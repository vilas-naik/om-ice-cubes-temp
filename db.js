import sqlite3 from "sqlite3";
const db = new sqlite3.Database('party_names.db');

db.serialize(() => {
    
db.all(`INSERT INTO PRINTED_BILLS_BACKUP(date_added,party_name,gst,amount,tax,total,month)
VALUES(?,?,?,?,?,?)`,[formattedToday,req.body.party,party_names[0].gst,amount,fakeTax,total,currentMonth], (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Success.');
    }
});
});
db.close();

