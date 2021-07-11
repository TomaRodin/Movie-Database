const data = (title,callback) => {
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('movies.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    });

    db.all("SELECT * FROM movies WHERE lower(title) LIKE "+"'%"+title.toLowerCase()+"%'",function (err,rows){
        callback(rows)
    })
        
}

module.exports = {
    getData:data
}