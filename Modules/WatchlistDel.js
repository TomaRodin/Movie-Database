function Delete(user,name) {
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('movies.sqlite', sqlite3.OPEN_READWRITE, (err) => {

    });
    db.run("DELETE FROM watchlist WHERE id ="+"'"+user+"'"+"AND movie ="+"'"+name+"'" );

}

module.exports = {
    Delete:Delete
}