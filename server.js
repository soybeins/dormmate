const e = require('express');

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
let lobby;
var loggedIn = false;

//====== Basic Routes ====== //
app.get('/', (req,res) => {
    if(!loggedIn){
        res.render('index');       
    }else{
        res.render('home', {user:user,lobby:lobby});
    }
});

app.get('/home', (req,res) => {
    if(!loggedIn){
        res.render('index');       
    }else{
        res.render('home', {user:user,lobby:lobby});
    }
});

app.get('/login', (req,res)=>{
    if(!loggedIn){
        res.render('login');       
    }else{
        res.render('home', {user:user,lobby:lobby});
    } 
});

app.get('/signup', (req,res)=>{
    if(!loggedIn){
        res.render('signup');       
    }else{
        res.render('home', {user:user,lobby:lobby});
    } 
});

app.get(('/findL'), (req,res)=>{
    
    if(!loggedIn){
        res.render('index');       
    }else{
        res.render('findLobby', {user:user,lobby:lobby});
    }     
});

app.get(('/room'), (req,res)=>{
    
    if(!loggedIn){
        res.render('index');       
    }else{
        res.render('room', {user:user,lobby:lobby});
    }
    
});

app.get(('/myRoom'), (req,res)=>{
    
    if(!loggedIn){
        res.render('index');       
    }else{
        res.render('myRoom', {user:user,lobby:lobby});
    }
    
});

app.get(('/hostL'), (req,res)=>{
    
    if(!loggedIn){
        res.render('index');       
    }else{
        res.render('hostLobby', {user:user,lobby:lobby});
    }
    
});

app.get(('/joinRoom'), (req,res)=>{
    if(!loggedIn){
        res.render('index');       
    }else{
        res.render('applicantChat', {user:user,lobby:lobby});
    }
});

app.get('/signout', (req,res)=>{
    loggedIn = false;
    user = null;
    lobby = null;
    res.redirect('/');
});

// ============= Functional Routes =========

//finding user route a.k.a. login with validation//
app.post('/findUser', (req,res)=>{
    console.log(req.body);
    let data = req.body;

    if(!data.username || !data.password){
        return res.status(200).render('login', {error:'true'});
    }

    var sql='SELECT count(UserID) as count,username,userid FROM users WHERE strcmp(USERNAME,BINARY ?) = 0 && strcmp(PASSWORD,?) = 0';
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
                db.query("SELECT count(lobbyid) as count,lobbyid,title,description,date,roommatemax, \
                roommatecount,agemin,agemax,genderselect,studentsonly,nosmoking,noalcohol,nopets from lobby WHERE lobbyhostid = ?",user[0].userid,(err,row)=> {
                    console.log("Searching if user has lobby.");
                    if(err){
                        console.log(err);      
                    }else{
                        if(row[0].count > 0){
                            lobby = row;
                            console.log("User has lobby = " + lobby[0].lobID);
                            // res.render('home',{page: 'home',user: user,lobby:lobby});
                            res.redirect('/home');
                        }else{
                            lobby=0;
                            console.log("User has no lobby = " + lobby);
                            // res.render('home',{page: 'home',user: user,lobby:lobby});
                            res.redirect('/home');
                        }
                    }
                });
            }else{
                console.log("data not found");
                res.render('login',{error:'User not found'} );
            }
        }
    });
});

//creating user route with validation//
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
            console.log("Value exists in db!");
            res.render('signup',{error:true});
            db.on('error', function(err) { //rethrow errors
                console.log("[mysql error]",err);
              });
        }
        else{
            console.log("Successfully Inserted!");
            res.redirect('login');
        }
    });            
});

//creating lobby route//
app.post('/createLobby',(req,res)=>{
    console.log(req.body);
    let data = req.body;

    var sql1 = "INSERT INTO lobby(lobbyhostid,password,title,description,date,roommatemax, \
        roommatecount,agemin,agemax,genderselect,studentsonly,nosmoking,noalcohol,nopets) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    var sql2 = "INSERT INTO location(lobbyid,address,rentingbudget,bookinglink,email,telephone,wifi) VALUES (?,?,?,?,?,?,?)";

    var sql3 = "INSERT INTO `roommate`(`LOBBYID`, `USERID`, `DEACTIVATE`, `KICKVOTES`) VALUES (?,?,'Active',0)";

    db.query(sql1,[data.userID,data.password,data.title,data.description,data.date, 
        data.roommates,0,data.minAge,data.maxAge,data.gender,data.studentsOnly,data.smoking,data.alcohol,data.pets], (err,row,fields)=>{
            console.log("Trying to create 1 new lobby");
            if(err){
                res.redirect('/hostL');
                console.log(err);         
            }else{
                console.log("successfully inserted lobby!");
            }
    });
    db.query("SELECT lobbyid,lobbyhostid,title,description,date,roommatemax, \
    roommatecount,agemin,agemax,genderselect,studentsonly,nosmoking,noalcohol,nopets from lobby WHERE lobbyhostid = ?",data.userID,(err,rows)=>{
        console.log("works");
        if(err){
            res.redirect('/hostL');
             throw err;
        }
        else{
            lobby = rows;
            console.log(rows);
            db.query(sql2, [lobby[0].lobbyid,data.address,data.rentAmount,data.booklink,data.email,data.telephone,data.wifi], (err,rows,fields)=>{
                if(!err){
                    console.log("successfully inserted location!");
                    db.query(sql3,[lobby[0].lobbyid,lobby[0].lobbyhostid],(err,rows,fields) => {
                        if(err){
                            res.redirect('/hostL');
                            throw err;
                        }else{
                            console.log("successfully inserted as roommate!");
                            console.log(lobby);
                            console.log(user);
                            res.redirect('/home');
                        }
                    });

                }
            });            
        }
    });

});



app.listen(8080);
console.log("8080 is the port friends");