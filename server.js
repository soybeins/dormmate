const express = require('express'),
      app = express(),
      mysql = require('mysql'),
      bodyParser= require('body-parser'),
      url = require('url');
//====== Body Parser for input data from body ======
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use(express.static("public"));

//====== Connect to DB ======
const db  = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'dormmatedb'
});
db.connect((err) =>{
    if(err){throw err;}
    console.log('Server Connected');
});

//====== For User Log Session ======
var user = null;
var loggedIn = false;

//====== Basic Routes ====== //
app.get('/', (req,res) => {
    if(!loggedIn){
        res.render('index');       
    }else{
        res.render('home', {user:user});
    }
});

app.get('/home', (req,res) => {
    if(!loggedIn){
        res.render('index');       
    }else{
        res.render('home', {user:user});
    }
});

app.get('/login', (req,res)=>{
    if(!loggedIn){
        res.render('login');       
    }else{
        res.render('home', {user:user});
    } 
});

app.get('/signup', (req,res)=>{
    if(!loggedIn){
        res.render('signup');       
    }else{
        res.render('home', {user:user});
    } 
});

app.get(('/findL'), (req,res)=>{
    
    if(!loggedIn){
        res.render('index');       
    }else{
        res.render('findLobby', {user:user});
    }     
});

app.get(('/room'), (req,res)=>{
    
    if(!loggedIn){
        res.render('index');       
    }else{
        res.render('room', {user:user});
    }
    
});

app.get(('/hostL'), (req,res)=>{
    
    if(!loggedIn){
        res.render('index');       
    }else{
        res.render('hostLobby', {user:user});
    }
    
});

app.get('/signout', (req,res)=>{
    loggedIn = false;
    res.redirect('/');
});

app.post('/findUser', (req,res)=>{
    console.log(req.body);
    let data = req.body;

    if(!data.username || !data.password){
        return res.status(401).render('login', {message:'Please provide an email and/or password.'});
    }

    var sql='SELECT count(UserID) as count,Email FROM users WHERE Email = ? && Password = ?';
    db.query(sql,[data.username,data.password],(err,row,fields)=>{
        console.log("Initiating Query.");
        if(err){
            console.log("Database is empty");
            res.redirect('/login');
            db.on('error', function(err) {
                console.log("[mysql error]",err);
              });
        }else{
            if(row[0].count == 1){
                user = row[0].Email;
                loggedIn = true;
                console.log("data found");
                res.render('home',{user: user});
            }else{
                console.log("data not found");
                res.redirect('/login');
            }
        }
    });
});

app.post('/create', (req,res)=>{
    console.log(req.body);
    let data = req.body;
    db.query('INSERT into user(Email,Password) VALUES (?,?)',[data.username,data.password],(err,rows,fields)=>{
        if(!err){
            res.redirect('/');
        }
        else{
            throw err;
        }
    });            
});

app.listen(8080);
console.log("8080 is the port friends");