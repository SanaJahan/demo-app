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
var http = require("http");
//module.exports = app;
var server = require('http').Server(app);
var port_number = app.set( 'port', process.env.PORT || 3001 );
app.listen(port_number);

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
                
                     <style>
.button {
  display: inline-block;
  padding: 15px 25px;
  font-size: 24px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: #4CAF50;
  border: none;
  border-radius: 15px;
  box-shadow: 0 9px #999;
}
.button:hover {background-color: #3e8e41}
.button:active {
  background-color: #3e8e41;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}
input[type=text] {
    border: 2px solid red;
    border-radius: 4px;
    width: 50%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    border: 1px solid #555;
    outline: none;
}
input[type=number] {
    border: 2px solid red;
    border-radius: 4px;
    width: 50%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    border: 1px solid #555;
    outline: none;
}
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
              <script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.14.0/jquery.validate.js"></script>
               
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
                    }, $.validator.format("Please enter exactly {0} characters."));
                    $("form[name='registration']").validate({
                      // Specify validation rules
                      rules: {
                        firstname: "required",
                        lastname: "required",
                        age: {
                          required: true,
                          range: [0,100]
                        },
                        gender: "required",
                        phone: {
                          required: true,
                          exactlength: 10
                        },
                        DOB: "required"
                      },
                      // Specify validation error messages
                      messages: {
                        firstname: "Please enter your firstname",
                        lastname: "Please enter your lastname",
                        age: {
                          required: "Please provide a valid age"
                        },
                        phone: "Please enter a valid phone number",
                        DOB: "PLease enter date of birth"
                      },
                      submitHandler: function(form) {
                        form.submit();
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
                <div id="login_area"> <form name="registration">
                   <p align = "center"><label> ENTER YOUR FIRSTNAME: </label><br>
                    <input type="text" id="firstname" name="firstname" placeholder="Your first name" /><br /><br/>
                    <label> ENTER YOUR LASTNAME: </label><br>
                    <input type="text" id="lastname" name="lastname" placeholder="Your last name" /></br><br>
                    <label> ENTER YOUR AGE:   </label><br>
                    <input type="number" id="age" name="age" placeholder="Your age" /><br /><br/>
                    <label> ENTER YOUR DOB:   </label><br>
                    <input type="text" id="DOB" name="DOB" placeholder="Your BirthDate" /><br /><br/>
                    <label> SELECT GENDER : </label><br>
                    <select id="gender" name ="gender" >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                      <br /><br />
                    <label> ENTER PHONENO. : </label><br>
                    <input type="number" id="phone" name="phone"  placeholder = "Your Phone number" /><br/>
                    <textarea id="random_text" rows="5" cols="60" name = "random_text" placeholder="Enter your text information"></textarea>
                     <br/><br/>
                     </p>
                    <br/><br/>
                    <p align = "center"><button class="button" id="register_btn" name="register_btn" />Register</button> </p>                             
                    <br><?form>
                    <center><a href = "/search">Already registered?Click here</a> </center>
                </div>
                <br><hr>
               <script type="text/javascript" src="/UI/main.js">
        </script>
            </body>
        </html> ` ;
        return htmlNewFormTemplate;
}

        
// Creating the database pool
//var pool = new Pool(config);
const env = process.env.DATABASE_URL;
var pool = pgp(env || config);
console.log("connect");
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
