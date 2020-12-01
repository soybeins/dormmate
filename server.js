const express = require('express'),
      app = express(),
      mysql = require('mysql'),
      bodyParser= require('body-parser'),
      url = require('url');
//====== Body Parser for input data from body ======
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
let user;
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

app.get(('/joinRoom'), (req,res)=>{
    if(!loggedIn){
        res.render('index');       
    }else{
        res.render('applicantChat', {user:user});
    }
});

app.get('/signout', (req,res)=>{
    loggedIn = false;
    user = null;
    res.redirect('/');
});

// ============= Functional Routes =========
app.post('/findUser', (req,res)=>{
    console.log(req.body);
    let data = req.body;

    if(!data.username || !data.password){
        return res.status(200).render('login', {error:'true'});
    }

    var sql='SELECT count(UserID) as count,username FROM users WHERE strcmp(USERNAME,BINARY ?) = 0 && strcmp(PASSWORD,?) = 0';
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
                user = row;
                loggedIn = true;
                console.log("user count = " + user[0].count);
                console.log("data found");
                res.render('home',{user: user});
            }else{
                console.log("data not found");
                res.render('login',{error:'User not found'} );
            }
        }
    });
});

app.post('/createUser', (req,res)=>{
    let data = req.body; 
    (data.smoker == null)?data.smoker = "No":null;
    (data.alcohol == null)?data.alcohol = "No":null;
    (data.pets == null)?data.pets = "No":null;

    console.log(data);

    if(!data.username || !data.password || !data.email || !data.gender|| !data.student || !data.bday){
        console.log("Error creating user. Incomplete data");
        return res.render('signup', {error:true,errorMessage:"Please provide all required inputs."});
    }


    var sql ='INSERT into users(Username,Email,Password,FirstName,LastName,Gender,Birthday, \
              Occupation,Schoolname,SchoolID,Schoollevel,VerifiedStudent,Smoking,Alcohol,Pets) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql,[data.username,data.email,data.password,data.fname,data.lname,data.gender,data.bday, 
            data.occupation,data.schoolname,data.schoolid,data.schoollevel,data.student,data.smoker,data.alcohol,data.pets],(err,rows,fields)=>{
        if(err){
            res.render('signup',{error:true});
            db.on('error', function(err) {
                console.log("[mysql error]",err);
              });
        }
        else{
            console.log("Successfully Inserted!");
            res.redirect('login');
        }
    });            
});



app.listen(8080);
console.log("8080 is the port friends");