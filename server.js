var express = require('express');
var morgan = require('morgan');
var path = require('path');
var session = require('express-session');
var Pool = require('pg').Pool;
var Client = require('pg').Client;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var pgp = require('pg-promise')();
var config = {
    user : 'postgres',
    database: 'patients',
    host: '127.0.0.1',
    port: '5434',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
//for patient details in another page
function createTemplate(listdata){
    var firstname = listdata.firstname;
    var lastname = listdata.lastname;
    var age = listdata.age;
    var gender = listdata.gender;
    var dob = listdata.dob;
    var phone=listdata.phone;
     
        var htmlTemplate =  `<html>
            <head>
                <title>list of patients</title>
                <meta name = "viewport" content = "width = device-width initial-scale=1" />
               
                <link href="/UI/style.css" rel="stylesheet" />
                <link rel="stylesheet"
                 href="https://fonts.googleapis.com/css?family=Baloo Tamma|David Libre|Open Sans Condensed|Ubuntu|Pavanam|Pacifico">
            </head>
            <body>
            <div id="app-heading"><header><h1 align = "left">Demo-App V1</h1></header></div><br/><br/>
                <div style="font-family: Pacifico;font-size: 1.5em">
                   <p align="left">
                    Name : ${firstname} ${lastname}  <br>
                    Age  : ${age} </br>
                    DOB  : ${dob} </br>
                    Gender: ${gender} <br/>
                    Phone : ${phone} <br/>
                   </p>
                </div>
           <script type="text/javascript" src="/UI/main.js"></script>
           </body>      
        </html> ` ;
        return htmlTemplate;
}


// form for adding patient
function createNewFormTemplate(){
        var htmlNewFormTemplate =  `<html>
            <head>
                <title>Please enter following details</title>
                <meta name = "viewport" content = "width = device-width initial-scale=1" />
                <link href="/UI/style.css" rel="stylesheet" />
                     <style>
                        input[type=text]:focus {
                            background-color: lightblue;
                        }
                        input[type=number]:focus {
                            background-color: lightblue;
                        }
                      </style>  
                   <link rel="stylesheet" href="https://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
                  <!-- Load jQuery JS -->
                  <script src="https://code.jquery.com/jquery-1.9.1.js"></script>
                  <!-- Load jQuery UI Main JS  -->
                  <script src="https://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
      
                    <script>
                          $(function() {
                          
                           $('#DOB').datepicker({
                          onSelect: function(value, ui) {
                              var today = new Date(),
                                  dob = new Date(value),
                                  age = today.getFullYear() - ui.selectedYear;

                              $('#age').val(age);
                          },
                          maxDate: '+0d',
                          yearRange: '1917:'+(new Date).getFullYear(),
                          changeMonth: true,
                          changeYear: true
                      });

                    });
                    </script>
            </head>
            <body>
            <div id="app-heading"><header><h1 align = "left">Demo-App V1</h1></header></div><br/><br/>
                <div class=container-articles>
                    <a href="/">Home</a>
                </div>
                <hr />
                <h2>Register here</h2>
                <div id="register_area">
                <form name="registration" id="registration">
                <p class="contact"><label for="firstname">First Name</label></p>
                <input id="firstname" name="firstname" placeholder="First name" required="" tabindex="1" type="text">
                <p class="contact"><label for="lastname">Last Name</label></p>
                <input id="lastname" name="lastname" placeholder="Last name" required="" tabindex="1" type="text">
                <p class="contact"><label for="dob">Your birthday</label></p>
                <input id="DOB" name="DOB" placeholder="Your birthdate" required="" type="text">
                <p class="contact"><label for="age">Your age</label></p>
                <input id="age" name="age" placeholder="Your age" required="" type="number">
                <p class="contact"><label for="gender">Your gender</label></p>
                <select class="select-style gender" name="gender" id="gender">
                <option value="select">I am..</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="others">Other</option>
                        </select><br><br>
                <p class="contact"><label for="phone">Mobile phone</label></p>
                <input id="phone" name="phone" placeholder="phone number" type="number">
                <p class="contact"><label for="text_area" id="random_text">Any queries</label></p>
                <textarea id="random_text" placeholder="Type your queries here" rows="5" cols="60" name = "random_text"></textarea><br>
                <center><input class="button" name="submit" id="register_btn" tabindex="5" value="Register" type="submit"></center>  
                </form>                            
                <br>
                <center><a href = "/">Already registered?Click here</a> </center>
                </div>
                <br><hr>
               <script type="text/javascript" src="/UI/main.js">
        </script>
            </body>
        </html> ` ;
        return htmlNewFormTemplate;
}

        
// Creating the database pool
//var client = new Client(process.env.DATABASE_URL);
var env = new Client(process.env.DATABASE_URL?ssl=true);
var pool = new Pool(env || config);
//INSERTING THE USERNAME and DETAILS FOR REGISTRATION


app.post('/create-user',function(req,res){
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var age = req.body.age;
  var dob = req.body.dob;
  var gender = req.body.gender;
  var phone = req.body.phone;
  var randomtext=req.body.randomtext;
  pool.query('INSERT INTO "patient_info" (firstname,lastname,age,dob,gender,phone,randomtext) VALUES ($1,$2,$3,$4,$5,$6,$7)',[firstname,lastname,age,dob,gender,phone,randomtext],function(err,result){
     if(err){
           res.status(500).send(err.toString());
       }
       else{
        res.send('User created succesfully '+ firstname);
     }
  });
});

//API for getting list of patients as JSON strings
app.get('/home',function(req,res){
    pool.query('SELECT userid,firstname,lastname FROM patient_info ORDER BY userid DESC' , function (err,result){
    if(err){
        res.status(500).send(err.toString());
    }
    else {
        listOfPatients=JSON.stringify(result.rows);
        res.send(listOfPatients);
        }  
   });
  });
//API to get separate patient details
app.get('/patient/:userid',function(req,res){
   //make a select request and return result set
   pool.query("SELECT * FROM patient_info WHERE userid= $1 ",[req.params.userid],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       }
       else{
        if(result.rows.length===0){
          res.status(404).send('patient not found');
        }
        else{
          var patientData = result.rows[0];
          res.send(createTemplate(patientData));
       }
     }
       });
       

});

//API for going to the registration form page
app.get('/newUser',function(req,res){
    res.send(createNewFormTemplate());
       });

        //Including all the files
app.get('/', function (req, res) {
res.sendFile(path.join(__dirname, 'UI', 'index.html'));
}); 
app.get('/UI/main.js', function (req, res) {
res.sendFile(path.join(__dirname, 'UI', 'main.js'));
});
app.get('/UI/style.css', function (req, res) {
res.sendFile(path.join(__dirname, 'UI', 'style.css'));
});
var port = 8080;
app.listen(8080, function () {
  console.log(`Web app listening on port ${port}!`);
});
