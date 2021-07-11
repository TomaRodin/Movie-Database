function CheckWatchlist(title,user,callback) {
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('movies.sqlite', sqlite3.OPEN_READWRITE, (err) => {

    });

    db.all("SELECT * FROM watchlist WHERE movie ="+"'"+title+"'"+"AND id ="+"'"+user+"'",function (err,rows){
        callback(rows)
    })
}

module.exports = {
    CheckWatchlist: CheckWatchlist
}