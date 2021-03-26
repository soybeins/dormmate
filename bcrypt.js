const   bcrypt = require('bcrypt');
//====== Bcrpyt Code ======
bcrypt.genSalt(11).then(salt =>{
    bcrypt.hash('sample', salt).then(hash =>{
        console.log(hash);
    })
})  
