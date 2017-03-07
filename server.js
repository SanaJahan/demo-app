var express = require('express');
var morgan = require('morgan');
var path = require('path');
var session = require('express-session');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var pgp = require('pg-promise')();
var config = {
    user : 'postgres',
    //client : 'postgresql',
    database: 'patients',
    host: '127.0.0.1',
    port: '5434',
    password: process.env.DB_PASSWORD
};
/*var pgPass = require('pgpass');
 
var connInfo = {
  'host' : 'ec2-23-21-219-105.compute-1.amazonaws.com' ,
  'user' : 'nfbkzdqhgmvrye' ,
};*/
 
/*pgPass(connInfo, function(pass){
  conn_info.password = pass;
  // connect to postgresql server 
});
var connectionString = "postgres://nfbkzdqhgmvrye:7d12a719b7e248ebbdcf05a6624ef4992c9c1131fbad79348661b031b92253f5@ec2-23-21-219-105.compute-1.amazonaws.com:5432/dcsd2plvcg32nk"
*/
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
                <!-- Include Required Prerequisites -->
              <script type="text/javascript" src="//cdn.jsdelivr.net/jquery/1/jquery.min.js"></script>
              <!-- <script type="text/javascript" src="//cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script> -->
              <script src="https://ajax.aspnetcdn.com/ajax/jquery.validate/1.14.0/jquery.validate.js"></script>
               
              <!-- Include Date Range Picker 
              <script type="text/javascript" src="//cdn.jsdelivr.net/bootstrap.daterangepicker/2/daterangepicker.js"></script>
              <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/bootstrap/3/css/bootstrap.css" />
              <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/bootstrap.daterangepicker/2/daterangepicker.css" />-->
             <script type="text/javascript"> 
                 //  first DOM loads
                  $(function() {
                    // Initialize form validation on the registration form.
                    jQuery.validator.addMethod("exactlength", function(value, phone, param) {
                     return this.optional(phone) || value.length == param;
                    }, $.validator.format("Please enter valid number"));
                    $("form[name='registration']").validate({
                      // Specify validation rules
                      rules: {
                        age: 
                         { range: [0,100]},
                        phone:
                          {exactlength: 10}
                      },
                      // Specify validation error messages
                      messages: {
                        age: {
                            range: "Please provide a valid age"
                        },
                      $("#registration").validate({
                        submitHandler: function(form) {
                         highlight: function(element, errorClass) {
                          $(element).fadeOut(function() {
                            $(element).fadeIn();
                          });
                        }
                          form.submit();
                        }
                      });
                    }
                    });
                  });
            </script>
            </head>
            <body>
                <div class=container-articles>
                    <a href="/">Home</a>
                </div>
                <hr />
                <h1>Welcome</h1>
                <div id="register_area">
                <form name="registration" id="registration">
                <p class="contact"><label for="firstname">First Name</label></p>
                <input id="firstname" name="firstname" placeholder="First name" required="" tabindex="1" type="text">
                <p class="contact"><label for="lastname">Last Name</label></p>
                <input id="lastname" name="lastname" placeholder="Last name" required="" tabindex="1" type="text">
                <p class="contact"><label for="age">Your age</label></p>
                <input id="age" name="age" placeholder="Your age" required="" type="number">
                <p class="contact"><label for="dob">Your birthday</label></p>
                <input id="DOB" name="DOB" placeholder="Your birthdate" required="" type="text">
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

const env = process.env.DATABASE_URL;
var pool = new Pool(config || env);
//console.log("connect");
//var pool = new pg.connect(connectionString);
/*var pool = new pg.Client(connectionString);
       function handleDisconnect() {
                          // the old one cannot be reused.
    pool.connect(function(err) {                // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('2. error when connecting to db:', err);
            setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
        }                                       // to avoid a hot loop, and to allow our node script to
    }); 
    };  */                                    // process asynchronous requests in the meantime.
      
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

//API for getting list of patients
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
