const data = (rate, decade, callback) => {
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('movies.sqlite', sqlite3.OPEN_READWRITE, (err) => {

    });
    
    
    db.all("SELECT * FROM movies WHERE vote_average >="+rate,function (err,rows){
        checkUsers = rows.filter(movie => movie.release_date >= decade);
        callback(checkUsers)
    })
}

module.exports = {
    getData:data
}