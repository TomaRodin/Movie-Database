const bodyParser = require('body-parser')
var express = require('express')
var cookieParser = require('cookie-parser')
var ejs = require('ejs');
const { response } = require('express');
var app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser())
app.set('view engine', 'ejs')


app.get('/',function(req,res){
    res.sendFile(__dirname+'/public/home.html')
})


app.get('/search/:name',function(req,res){
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('movies.sqlite', sqlite3.OPEN_READWRITE, (err) => {

    });
    var title = req.params.name
    db.all("SELECT * FROM movies WHERE lower(title) ="+"'"+title.toLowerCase()+"'",function (err,rows){
        var row = rows[0]
        if (row == undefined) {
            res.send('Not Found')
        }
        else {
            res.render(__dirname+'/public/movie.ejs', {title:row.title, release: row.release_date, budget:row.budget, plot:row.overview})
        }
    })
})

app.get('/movies/search',function(req,res){
    res.sendFile(__dirname+'/public/ad.html')
})

app.get('/advanced_search/:name',function(req,res){
    var title = req.params.name
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('movies.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    });

    db.all("SELECT * FROM movies WHERE lower(title) LIKE "+"'%"+title.toLowerCase()+"%'",function (err,rows){
        res.json(rows)
    })
        
    
})


app.listen(3000);



