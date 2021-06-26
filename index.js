const bodyParser = require('body-parser')
var express = require('express')
var cookieParser = require('cookie-parser')
var ejs = require('ejs');
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
    var title = req.params.name
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('movies.sqlite', sqlite3.OPEN_READWRITE, (err) => {

    });
    
    
    db.all("SELECT * FROM movies WHERE lower(title) ="+"'"+title.toLowerCase()+"'",function (err,rows){
        
        
        if (rows == undefined) {
            res.send('Not Found')
        }
        else {
            var row = rows[0]
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

app.get('/find',function(req,res){
    res.sendFile(__dirname+'/public/find.html')
})


app.get('/find/:number/:decade',function(req,res){
    var rate = req.params.number
    var decade = req.params.decade
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('movies.sqlite', sqlite3.OPEN_READWRITE, (err) => {

    });
    
    
    db.all("SELECT * FROM movies WHERE vote_average >="+rate,function (err,rows){
        checkUsers = rows.filter(movie => movie.release_date >= decade);
        res.json(checkUsers)
    })
})



app.get('/images/star.svg',function(req,res){
    res.sendFile(__dirname+'/public/image/star.svg')
})

app.get('/images/money-bag.svg',function(req,res){
    res.sendFile(__dirname+'/public/image/money-bag.svg')
})

app.get('/images/director-chair.svg',function(req,res){
    res.sendFile(__dirname+'/public/image/director-chair.svg')
})

app.get('/images/clapperboard.svg',function(req,res){
    res.sendFile(__dirname+'/public/image/clapperboard.svg')
})


app.listen(3000);



