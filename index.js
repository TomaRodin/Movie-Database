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
            var cookie = req.cookies.user
            res.render(__dirname+'/public/movie.ejs', {title:row.title, release: row.release_date, budget:row.budget, plot:row.overview, user: cookie})
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





app.get('/login',function(req,res){
    if (req.cookies.LoggedIn == undefined) {
        res.sendFile(__dirname+'/public/login.html')
    } else {
        res.redirect('/user')
    }
})


app.post('/login',function(req,res){
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('movies.sqlite', sqlite3.OPEN_READWRITE, (err) => {

    });
    
    
    db.all("SELECT * FROM users WHERE name ="+"'"+req.body.name+"'"+"AND pass ="+"'"+req.body.pass+"'",function (err,rows){
        var row = rows[0]
        if (row == undefined) {
            res.redirect('/login')
        } else {
            var row = rows[0]
        res.cookie('user',row.id)
        res.redirect('/user')
        }
    }) 
        
})


app.get('/user',function(req,res){
    if (req.cookies.user == undefined) {
        res.redirect('/login')
    } else {
        const sqlite3 = require('sqlite3').verbose();
        let db = new sqlite3.Database('movies.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    
        });
        db.all("SELECT * FROM users WHERE id ="+"'"+req.cookies.user+"'",function (err,rows){
            var row = rows[0]
            res.render(__dirname+'/public/user.ejs', {name:row.name,pass:row.pass})
        })

        
    }
})

app.get('/user/log_out',function(req,res){
    if (req.cookies.user == undefined) {
        res.redirect('/')
    }
    else {
        res.clearCookie('user');
        res.redirect('/')
    }
})

app.post('/save_watchlist',function(req,res){

    if (req.cookies.user == undefined) {
        res.redirect('/login')
    }
    else{
            const sqlite3 = require('sqlite3').verbose();
            let db = new sqlite3.Database('movies.sqlite', sqlite3.OPEN_READWRITE, (err) => {

            });

            db.all("SELECT * FROM watchlist WHERE movie ="+"'"+req.body.name+"'"+"AND id ="+"'"+req.cookies.user+"'",function (err,rows){
                var row = rows[0]
                if (row == undefined) {
                    db.run("INSERT INTO watchlist (id,movie ) VALUES ('"+ req.cookies.user +"','"+req.body.name+"')");
                }
                else {
                    return true
                }
            })    
    }

})


app.get('/register',function(req,res){
    if (req.cookies.user == undefined) {
        res.sendFile(__dirname+'/public/register.html')
    } else {
        res.redirect('/user')
    }
})

app.post('/register',function(req,res){
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('movies.sqlite', sqlite3.OPEN_READWRITE, (err) => {

    });
    db.all("SELECT * FROM users WHERE name ="+"'"+req.body.newname+"'",function (err,rows){
        var row = rows[0]
        if (row == undefined) {
            db.all("SELECT * FROM users WHERE pass ="+"'"+req.body.newpass+"'",function (err,rows){
                var row = rows[0]
                if (row == undefined) {
                    var uniqid = require('uniqid');
                    var id = uniqid()
                    db.run("INSERT INTO users (name,pass,id ) VALUES ('"+ req.body.newname +"','"+req.body.newpass+"','"+id+"')");
                    res.redirect('/login')
                } else {
                    res.send('Exist')
                }
            })
        } else {
            res.send('Exist')
        }
    })
})


app.get('/watchlist',function(req,res){
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('movies.sqlite', sqlite3.OPEN_READWRITE, (err) => {

    });
    db.all("SELECT * FROM watchlist WHERE id ="+"'"+req.cookies.user+"'",function (err,rows){
        console.log(rows)
        res.json(rows)
    })

})

app.get('/check_watchlist/:title',function(req,res){
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('movies.sqlite', sqlite3.OPEN_READWRITE, (err) => {

    });

    db.all("SELECT * FROM watchlist WHERE movie ="+"'"+req.params.title+"'"+"AND id ="+"'"+req.cookies.user+"'",function (err,rows){
        res.json(rows)
    })
})


app.post('/remove_watchlist',function(req,res){
    if (req.cookies.user == undefined) {
        res.redirect('/login')
    }
    else{
            const sqlite3 = require('sqlite3').verbose();
            let db = new sqlite3.Database('movies.sqlite', sqlite3.OPEN_READWRITE, (err) => {

            });
            db.run("DELETE FROM watchlist WHERE id ="+"'"+req.cookies.user+"'"+"AND movie ="+"'"+req.body.name+"'" );
    }
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

app.get('/images/user.svg',function(req,res){
    res.sendFile(__dirname+'/public/image/user.svg')
})


app.listen(3000);



