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

//====== Soket.io Setup ======
const formatMessage = require('./utils/messages');
const socketio = require('socket.io'),
      http     = require('http'),
      server   = http.createServer(app),
      io       = socketio(server);

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
let location;
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

app.get('/profile', (req,res)=>{
    if(!loggedIn){
        res.render('index');       
    }else{
        let sql = 'SELECT * FROM users WHERE userid = ?'
        db.query(sql, user[0].userid, (err, row) => {
            if(err){
                throw err;
            }else{
                res.render('profile', {user:user, lobby:lobby, prof: row});
            }
        });
    }
});

var id;

app.get('/editAccount', (req, res) =>{
    id = req.query.id;

    if(!loggedIn){
        res.render('index');       
    }else{
        let sql = 'SELECT username, email, password FROM users WHERE userid = ?'
        db.query(sql, id, (err, row) => {
            if(err){
                throw err;
            }else{
                console.log(row);
                res.render('editAccount', {user:user, lobby:lobby, info: row});
            }
        })
    }
});

app.post('/editAccountInfo', (req, res) => {
    let data = req.body;

    let sql = 'UPDATE users SET username = ?, email = ?, password = ? WHERE userid = ?'
    db.query(sql, [data.username, data.email, data.password, id], (err, row) => {
        if(err){
            throw err;
        }else{
            res.redirect('/profile');
        }
    })
})

app.get('/editPersonal', (req, res) =>{
    id = req.query.id;

    if(!loggedIn){
        res.render('index');       
    }else{
        let sql = "SELECT *, DATE_FORMAT(BIRTHDAY,'%y-%m-%d') as bday FROM users WHERE userid = ?"
        db.query(sql, id, (err, row) => {
            if(err){
                throw err;
            }else{
                console.log(row);
                res.render('editPersonal', {user:user, lobby:lobby, info: row});
            }
        })
    }
});

app.post('/editPersonalInfo', (req, res) => {
    let data = req.body;

    let sql = 'UPDATE users SET firstname = ?, lastname = ?, birthday = ?, occupation = ?, verifiedstudent = ?, schoollevel = ?, schoolid = ?, schoolname = ?, smoking = ?, pets = ?, alcohol = ? WHERE userid = ?'
    db.query(sql, [data.fname, data.lname, data.bday, data.occupation, data.student, data.schoollevel, data.schoolid, data.schoolname, data.smoker, data.pets, data.alcohol, id], (err, row) => {
        if(err){
            throw err;
        }else{
            res.redirect('/profile');
        }
    })
})

app.get('/signup', (req,res)=>{
    if(!loggedIn){
        res.render('signup');       
    }else{
        res.render('home', {user:user,lobby:lobby});
    } 
});
 
var mylobby, roommates;

app.get(('/viewRoom'), (req,res)=>{
    let lobbyid;
    let id = req.query.id;
    if(lobby === 0){
        lobbyid = id;
    }else{
        lobbyid = lobby;
    }

    if(!loggedIn){
        res.render('index');       
    }else{
        let sql1 = 'SELECT * FROM location INNER JOIN lobby ON LOCATIOn.LOBBYID = lobby.LOBBYID WHERE location.LOBBYID = ?'
        db.query(sql1, lobbyid, (err, row) => {
            if(err){
                throw err;
            }else{
                
                if(row.length === 1){
                    mylobby = row; 

                    let sql4 = 'SELECT userid FROM roommate WHERE lobbyid = ? AND userid = ?'
                    db.query(sql4, [mylobby[0].LOBBYID, user[0].userid], (err, row) => {
                        if(err){
                            throw err;
                        }else{
                            if(row.length != 1){
                                let sql = 'UPDATE lobby SET views = ? + 1 WHERE lobbyid = ?'
                                db.query(sql,[mylobby[0].VIEWS, mylobby[0].LOBBYID], (err, row) =>{});
                            }
                        }
                    })

                    let sql2 = 'SELECT users.userid, users.username, users.firstname, users.lastname, users.profilepicture, users.upvote, users.downvote FROM users INNER JOIN roommate ON users.USERID = roommate.USERID WHERE roommate.lobbyid = ?'
                    db.query(sql2, lobbyid, (err, row) => {
                        roommates = row;

                        let sql3 = 'SELECT users.FIRSTNAME, users.LASTNAME, applicants.APPLICANTID, applicants.APPROVED FROM users INNER JOIN applicants ON users.USERID = applicants.APPLICANTID WHERE applicants.LOBBYID = ? AND applicants.APPLICANTID = ?';
                        db.query(sql3, [lobbyid, user[0].userid], (err, row) => {
                            if(user[0].userid === mylobby[0].LOBBYHOSTID){
                                res.render('myRoom', {user:user, lobby:mylobby, roommate:roommates});
                            }else{
                                res.render('room', {roommates: roommates, user: user, lobby: mylobby, applicant: row});
                            }
                        });
                    });       
                }else{
                    console.log("data not found");
                    res.redirect('/findL');
                }
            }
        });
    } 
    
});

app.get(('/myRoom'), (req,res)=>{
    
    if(!loggedIn){
        res.render('index');       
    }else{
        res.render('myRoom', {user:user,lobby:lobby,location:location});
    }
    
});

app.get(('/hostL'), (req,res)=>{
    
    if(!loggedIn){
        res.render('index');       
    }else{
        res.render('hostLobby', {user:user,lobby:lobby,error:false});
    }
    
});

app.get(('/joinRoom'), (req,res)=>{
    if(!loggedIn){
        res.render('index');       
    }else{
        let sql2 = 'SELECT userid, firstname, lastname FROM users WHERE userid = ?'
        db.query(sql2, mylobby[0].LOBBYHOSTID, (err, row, field) => {
            var host = row;

            let sql = 'SELECT users.FIRSTNAME, users.LASTNAME, roommatechat.USERID, roommatechat.DATE, roommatechat.TIME, roommatechat.CHATMESSAGE FROM users INNER JOIN roommatechat ON users.USERID = roommatechat.USERID WHERE roommatechat.LOBBYID = ?'
            db.query(sql, mylobby[0].LOBBYID, (err, row) => {
                var chat = row;

                let sql3 = 'SELECT users.FIRSTNAME, users.LASTNAME, applicants.APPLICANTID, applicants.APPROVED FROM users INNER JOIN applicants ON users.USERID = applicants.APPLICANTID WHERE applicants.LOBBYID = ?';
                db.query(sql3, mylobby[0].LOBBYID, (err, row) => {
                    res.render('chat', {host: host, chat: chat, current: user, roomies: roommates, applicants: row, lobby: mylobby});
                });
            });
        });
    }
});

app.get('/signout', (req,res)=>{
    loggedIn = false;
    user = null;
    lobby = null;
    location = null;
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

    var sql='SELECT count(UserID) as count,firstname, lastname, username, userid, profilepicture FROM users WHERE strcmp(USERNAME,BINARY ?) = 0 && strcmp(PASSWORD,?) = 0';
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
                db.query("SELECT count(lobbyid) as count,lobbyid,lobbyhostid,title,description,DATE_FORMAT(date,'%y-%m-%d') as date,roommatemax, \
                roommatecount,views,agemin,agemax,genderselect,studentsonly,nosmoking,noalcohol,nopets from lobby WHERE lobbyhostid = ?",user[0].userid,(err,row)=> {
                    console.log("Searching if user has lobby.");
                    if(err){
                        console.log(err);      
                    }else{
                        if(row[0].count > 0){
                            lobby = row[0].lobbyid;
                            console.log("User has lobby = " + lobby);
                            // res.render('home',{page: 'home',user: user,lobby:lobby});
                            res.redirect('/home');
                        }else{
                            lobby=0;
                            console.log("User has no lobby = " + lobby);
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

//creating lobby route with validation//
app.post('/createLobby',(req,res)=>{
    console.log(req.body);
    let data = req.body;
    
    if(!data.title|| !data.description|| !data.date|| !data.roommates|| !data.name|| !data.address){
        console.log("Did not create lobby due to lack of information");
        return res.render('hostLobby', {user:user,error:true});
    }


    var sql1 = "INSERT INTO lobby(lobbyhostid,title,description,date,roommatemax, \
        roommatecount,views,agemin,agemax,genderselect,studentsonly,nosmoking,noalcohol,nopets) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    var sql2 = "INSERT INTO location(lobbyid,name,address,image,rentingbudget,bookinglink,email,telephone,wifi) VALUES (?,?,?,?,?,?,?,?,?)";

    var sql3 = "INSERT INTO `roommate`(`LOBBYID`, `USERID`, `DEACTIVATE`, `KICKVOTES`) VALUES (?,?,'Active',0)";

    db.query(sql1,[data.userID,data.title,data.description,data.date, 
        data.roommates,1,0,data.minAge,data.maxAge,data.gender,data.studentsOnly,data.smoking,data.alcohol,data.pets], (err,row,fields)=>{
            console.log("Trying to create 1 new lobby");
            if(err){
                res.redirect('/hostL');
                console.log(err);         
            }else{
                console.log("successfully inserted lobby!");
            }
    });
    db.query("SELECT lobbyid,lobbyhostid,title,description,DATE_FORMAT(date,'%y-%m-%d') as date,roommatemax, \
    roommatecount,views,agemin,agemax,genderselect,studentsonly,nosmoking,noalcohol,nopets from lobby WHERE lobbyhostid = ?",data.userID,(err,rows)=>{
        console.log("works");   
        if(err){
            res.redirect('/hostL');
             throw err;
        }
        else{
            lobby = rows;
            console.log(rows);
            db.query(sql2, [lobby[0].lobbyid,data.name,data.address,data.image,data.rentAmount,data.booklink,data.email,data.telephone,data.wifi], (err,rows,fields)=>{
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

app.get('/findL', (req,res)=>{
    var sql = "SELECT u.VERIFIEDSTUDENT,u.USERNAME,u.USERID,u.PROFILEPICTURE,loc.IMAGE,loc.ADDRESS,loc.RENTINGBUDGET,\
    loc.WIFI,loc.NAME,l.LOBBYID,l.TITLE,l.DESCRIPTION,l.VIEWS,DATE_FORMAT(l.DATE,'%y-%m-%d') as DATE,\
    l.ROOMMATEMAX,l.ROOMMATECOUNT,l.AGEMIN,l.AGEMAX,l.STUDENTSONLY,l.GENDERSELECT,l.VIEWS,l.NOSMOKING,l.NOALCOHOL,l.NOPETS \
    from users u join lobby l on u.USERID = l.LOBBYHOSTID join location loc on l.LOBBYID = loc.LOBBYID";
 
    if(!loggedIn){
        return res.render('index');       
    }else{
        db.query(sql,(err,row)=>{
            console.log("Searching all lobbies...");
            if (err){
                throw err;
            }else{
                res.render('findLobby', {user:user,lobby:lobby,lobbies:row,locFil:false});
            }
        });
    }     
});
// ========================= editMyRoom ======================== //
app.post('/editMyRoom',(req,res)=>{
    if(!loggedIn){
        res.render('index');       
    }else{
        db.query("select * from lobby l join location loc on l.LOBBYID = loc.LOBBYID where l.LOBBYID = ?",[lobby],(err,row)=>{
            if(!err){
                res.render('editLobby', {user:user,lobby:row,error:false});
            }
        })
    }
})
//============================================================== //

app.post('/updateLobby',(req,res)=>{
    console.log(req.body);
    data = req.body;
    var sql = "update lobby set title = ?,description = ?,roommatemax = ?, genderselect = ?, agemin = ?, agemax = ?, studentsonly = ?, \
            nosmoking = ?,nopets = ?,noalcohol = ? where lobbyid = ?";
    var sql2 = "update location set name = ?,address = ?,wifi = ?, rentingbudget = ?, image = ?, bookinglink = ?, email = ?, telephone = ? where lobbyid = ?";

    db.query(sql,[data.title,data.description,data.roommates,data.gender,data.minAge,data.maxAge,data.studentsOnly,data.smoking,
            data.pets,data.alcohol,data.lobbyid],(err)=>{
        if(err){
            throw err;
        }else{
            db.query(sql2,[data.name,data.address,data.wifi,data.rentAmount,data.image,data.booklink,data.email,data.telephone,data.lobbyid],(err)=>{
                if(!err){
                    db.query("SELECT count(lobbyid) as count,lobbyid,lobbyhostid,title,description,DATE_FORMAT(date,'%y-%m-%d') as date,roommatemax, \
                    roommatecount,views,agemin,agemax,genderselect,studentsonly,nosmoking,noalcohol,nopets from lobby WHERE lobbyhostid = ?",user[0].userid,(err,row)=> {
                        console.log("Searching if user has lobby.");
                        if(err){
                            console.log(err);      
                        }else{
                            if(row[0].count > 0){
                                lobby = row[0].lobbyid;
                                console.log("User has lobby = " + lobby);
                                res.redirect('/home');
                            }else{
                                lobby=0;
                                console.log("User has no lobby = " + lobby);
                                res.redirect('/home');
                            }
                        }
                    });
                }

            })
        }

    })


})

app.post('/findL', (req,res)=>{
    var sql = "SELECT u.VERIFIEDSTUDENT,u.USERNAME,u.USERID,u.PROFILEPICTURE,loc.IMAGE,loc.ADDRESS,loc.RENTINGBUDGET, \
    loc.WIFI,loc.NAME,l.LOBBYID,l.TITLE,l.DESCRIPTION,l.VIEWS,DATE_FORMAT(l.DATE,'%y-%m-%d') as DATE,\
    l.ROOMMATEMAX,l.ROOMMATECOUNT,l.AGEMIN,l.AGEMAX,l.STUDENTSONLY,l.GENDERSELECT,l.VIEWS,l.NOSMOKING,l.NOALCOHOL,l.NOPETS \
    from users u join lobby l on u.USERID = l.LOBBYHOSTID join location loc on l.LOBBYID = loc.LOBBYID where loc.address LIKE ? \
    AND l.GENDERSELECT in (?,?)AND loc.WIFI REGEXP ? AND l.STUDENTSONLY REGEXP ? AND l.NOSMOKING REGEXP ? AND l.NOALCOHOL REGEXP ? AND l.NOPETS REGEXP ?";
    var gender2;
    let locFil = req.body.locFil;
    let gender = req.body.gender;
    let wifi = req.body.wifi;
    let studOnly = req.body.studentsonly;
    let nopets = req.body.nopets;
    let nosmoking = req.body.nosmoking;
    let noalcohol = req.body.noalcohol;

    (!locFil)? locFil="% %":locFil = "%" + locFil + "%";
    (wifi=="---")? wifi="^[a-z]":wifi = "^[" + wifi + "]";
    (studOnly=="---")? studOnly="^[a-z]":studOnly = "^[" + studOnly + "]";
    (nosmoking=="---")? nosmoking="^[a-z]":nosmoking = "^[" + nosmoking + "]";
    (noalcohol=="---")? noalcohol="^[a-z]":noalcohol = "^[" + noalcohol + "]";
    (nopets=="---")? nopets="^[a-z]":nopets = "^[" + nopets + "]";

    if(gender == "---"){
        gender = "Male";
        gender2 = "Female";
    }else{
        gender2 = gender;
    }

    console.log(wifi);

    if(!loggedIn){
        return res.render('index');       
    }else{
        db.query(sql,[locFil,gender,gender2,wifi,studOnly,nosmoking,noalcohol,nopets],(err,row)=>{
            console.log("Searching all lobbies...");
            if (err){
                throw err;
            }else{
                // console.log(row);
                res.render('findLobby', {user:user,lobby:lobby,lobbies:row,locFil:locFil});
            }
        });
    }     
});

app.get('/deleteRoom',(req,res)=>{
    console.log("Deleting room..");
    var sql ="DELETE FROM `roommate` WHERE lobbyid = ?";
    var sql1 ="DELETE FROM `location` WHERE lobbyid = ?";
    var sql2 ="DELETE FROM `lobby` WHERE lobbyid = ?";

    db.query(sql,[lobby[0].lobbyid],(err)=>{
        db.query(sql1,[lobby[0].lobbyid],(err)=>{
            db.query(sql2,[lobby[0].lobbyid],(err)=>{
                if(!err){
                    lobby = 0;
                    res.redirect('/home');
                }
            });
        });
    });
})

//LOBBY AND CHAT FUNCTIONALITIES
app.get('/apply', (req, res) => {
    if(!loggedIn){
        res.render('index');
    }else{
        let sql = 'INSERT INTO applicants (LOBBYID, APPLICANTID) VALUES (?, ?)';
        db.query(sql, [mylobby[0].LOBBYID, user[0].userid], (err, row) => {
            if(err){
                throw err;
            }else{
                console.log("Application Inserted");
                res.redirect('/viewRoom?id=' + mylobby[0].LOBBYID);
            }
        });
    }
});

app.get('/cancel', (req, res) => {
    let sql = 'DELETE FROM applicants WHERE applicantid = ?';
    db.query(sql, user[0].userid, (err, row) => {
        if(err){
            throw err;
        }else{
            res.redirect('/viewRoom?id=' + mylobby[0].LOBBYID);
        }
    });
});

app.get('/accept', (req, res) => {
    var id = req.query.id;

    let sql = 'DELETE FROM applicants WHERE applicantid = ?';
    db.query(sql, id, (err, row) => {
        if(err){
            throw err;
        }else{
            let sql3 = 'UPDATE lobby SET roommatecount = ? + 1 WHERE lobbyid = ?';
            db.query(sql3, [mylobby[0].ROOMMATECOUNT, mylobby[0].LOBBYID], (err, row) => {
                if(err){
                    throw err;
                }else{
                    let sql2 = 'INSERT INTO roommate (lobbyid, userid) VALUES (?, ?)';
                    db.query(sql2, [mylobby[0].LOBBYID, id], (err, row) => {
                        if(err){
                            throw err;
                        }else{
                            res.redirect('/joinRoom');
                        }
                    });
                }
            });
        }
    });
});

app.get('/decline', (req, res) => {
    var id = req.query.id;

    let sql = 'UPDATE applicants SET approved = ? WHERE applicantid = ?';
    db.query(sql, ['F', id], (err, row) => {
        if(err){
            throw err;
        }else{
            res.redirect('/joinRoom');
        }
    });
});

app.get('/leave', (req, res) => {
    var id = req. query.id;

    let sql = 'DELETE FROM roommate WHERE userid = ?';
    db.query(sql, id, (err, row) => {
        if(err){
            throw err;
        }else{
            let sql2 = 'UPDATE lobby SET roommatecount = ? - 1 WHERE lobbyid = ?';
            db.query(sql2, [mylobby[0].ROOMMATECOUNT, mylobby[0].LOBBYID], (err, row) => {
                if(err){
                    throw err;
                }else{
                    res.redirect('/findL');
                }
            });
        }
    });
});

app.get('/kick', (req, res) => {
    var id = req. query.id;

    let sql = 'DELETE FROM roommate WHERE userid = ?';
    db.query(sql, id, (err, row) => {
        if(err){
            throw err;
        }else{
            let sql2 = 'UPDATE lobby SET roommatecount = ? - 1 WHERE lobbyid = ?';
            db.query(sql2, [mylobby[0].ROOMMATECOUNT, mylobby[0].LOBBYID], (err, row) => {
                if(err){
                    throw err;
                }else{
                    res.redirect('/joinRoom');
                }
            });
        }
    });
});


app.post('/findL', (req,res)=>{
    var sql = "SELECT u.VERIFIEDSTUDENT,u.USERNAME,u.USERID,u.PROFILEPICTURE,loc.IMAGE,loc.ADDRESS,loc.RENTINGBUDGET, \
    loc.WIFI,loc.NAME,l.LOBBYID,l.TITLE,l.DESCRIPTION,l.VIEWS,DATE_FORMAT(l.DATE,'%y-%m-%d') as DATE,\
    l.ROOMMATEMAX,l.ROOMMATECOUNT,l.AGEMIN,l.AGEMAX,l.STUDENTSONLY,l.GENDERSELECT,l.VIEWS,l.NOSMOKING,l.NOALCOHOL,l.NOPETS \
    from users u join lobby l on u.USERID = l.LOBBYHOSTID join location loc on l.LOBBYID = loc.LOBBYID where loc.address LIKE ? \
    AND l.GENDERSELECT in (?,?)AND loc.WIFI REGEXP ? AND l.STUDENTSONLY REGEXP ? AND l.NOSMOKING REGEXP ? AND l.NOALCOHOL REGEXP ? AND l.NOPETS REGEXP ?";
    var gender2;
    let locFil = req.body.locFil;
    let gender = req.body.gender;
    let wifi = req.body.wifi;
    let studOnly = req.body.studentsonly;
    let nopets = req.body.nopets;
    let nosmoking = req.body.nosmoking;
    let noalcohol = req.body.noalcohol;

    (!locFil)? locFil="% %":locFil = "%" + locFil + "%";
    (wifi=="---")? wifi="^[a-z]":wifi = "^[" + wifi + "]";
    (studOnly=="---")? studOnly="^[a-z]":studOnly = "^[" + studOnly + "]";
    (nosmoking=="---")? nosmoking="^[a-z]":nosmoking = "^[" + nosmoking + "]";
    (noalcohol=="---")? noalcohol="^[a-z]":noalcohol = "^[" + noalcohol + "]";
    (nopets=="---")? nopets="^[a-z]":nopets = "^[" + nopets + "]";

    if(gender == "---"){
        gender = "Male";
        gender2 = "Female";
    }else{
        gender2 = gender;
    }

    console.log(wifi);

    if(!loggedIn){
        return res.render('index');       
    }else{
        db.query(sql,[locFil,gender,gender2,wifi,studOnly,nosmoking,noalcohol,nopets],(err,row)=>{
            console.log("Searching all lobbies...");
            if (err){
                throw err;
            }else{
                // console.log(row);
                res.render('findLobby', {user:user,lobby:lobby,lobbies:row,locFil:locFil});
            }
        });
    }     
});

io.on('connection', (socket) => {
    socket.on('chatmessage', msg => {
        io.emit('message', formatMessage(user[0].firstname, msg));

        var info = formatMessage(user[0].username, msg); 

        var sql1 = 'INSERT INTO roommatechat(userid, date, time, chatmessage, lobbyid) VALUE (?, ?, ?, ?, ?)';
        
        db.query(sql1, [user[0].userid, info.date, info.time, info.message, mylobby[0].LOBBYID], (err, res) => {
            if(err){
                throw err;
            }else{
                console.log('SUCCESSFULLY ADDED CHAT INFO');
            }
        }); 
    });
});


server.listen(8080, () => console.log("8080 is the port friends"));








// app.get('/enterMyRoom',(req,res)=> {
//     var sql = "SELECT name,image,address,rentingbudget,bookinglink,email, \
//              telephone,wifi,upvotes,downvotes,finallocation FROM location WHERE lobbyid = ?";

//     var sql2= "SELECT r.USERID,r.ROOMMATEID,r.LOBBYID,u.FIRSTNAME,u.LASTNAME,u.PROFILEPICTURE,\
//              u.USERNAME,u.UPVOTE,u.DOWNVOTE from roommate r join users u on r.USERID = u.USERID where r.LOBBYID = ?";
//     db.query(sql,[lobby[0].lobbyid],(err,rows,fields)=> {
//         if(err){
//             throw err
//         }else{
//             location = rows;
//             console.log("Successfully got location details");
//             db.query(sql2,[lobby[0].lobbyid],(err,row)=>{
//                 if(err){
//                     console.log(err);
//                 }else{
//                     console.log(row);
//                     res.render('myRoom',{user:user,lobby:lobby,location:location,roommate:row});
//                 }
//             });
//         }
//     });
// })