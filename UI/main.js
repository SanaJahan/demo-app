//Register new user
var register = document.getElementById('register_btn');
   if (register != undefined) {
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              if (request.status === 200) {
                  alert('User created successfully');
                  document.location.href = "/";
                }
              else
               {document.location.href = "/newUser";
              } 
              else if(request===403){
                  alert('Could not register the user');
                  register.value = 'Register';
              }  
          } 
        };
        // Make the request
        var firstname = document.getElementById('firstname').value;
        var lastname =  document.getElementById('lastname').value;
        var age =  document.getElementById('age').value;
        var dob =  document.getElementById('DOB').value;
        var gender = document.getElementById('gender').value;
        var phone = document.getElementById('phone').value;
        var randomtext = document.getElementById('random_text').value;
        request.open('POST','/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({firstname: firstname, lastname: lastname,age: age,dob:dob,gender: gender, phone: phone, randomtext: randomtext}));  
        register.value = 'Registering...';
    };
   }

   // Make request for retrieving the list of patients
// Make request for retrieving the list of patients

   function loadList () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var list = document.getElementById('list');
            var search = document.getElementById('search_button');
            if (request.status === 200) {
                var content = '<ul>';
                var listData = JSON.parse(this.responseText);
                for (var i=0; i< listData.length; i++) {
                    content += `<html> 
            <head>
                <meta name = "viewport" content = "width = device-width initial-scale=1" />
                  <title></title>
                      </head>
                       <style>
                        #list ul li a {
                        top:30px;
                        padding-left: 15px;
                        padding-right: 25px;
                        padding-bottom: 15px;
                        padding-top: 15px;
                        font-size: 15px;
                        font-weight: 400;
                        color: #CC0099;
                        font-family: "Abhaya Libre";
                        text-align: center;
                        text-decoration: none;
                        text-transform: uppercase;
                        margin:auto;
                    }
                     #list ul li a:hover {
                      background: #FFCC00;
                      color: #000;
                      -webkit-text-stroke:1px black;
                    }
                    ul{
                        list-style-type: none;
                    }
                    body{
                         background: red; /* For browsers that do not support gradients */
                        // background: -webkit-linear-gradient(#FAF2FD,#E4BFF4); /* For Safari 5.1 to 6.0 */
                         /*background: -o-linear-gradient(#FAF2FD,#E4BFF4); /* For Opera 11.1 to 12.0 */
                         //background: -moz-linear-gradient(#FAF2FD,#E4BFF4); /* For Firefox 3.6 to 15 */
                         //background: linear-gradient(#FAF2FD,#E4BFF4); /* Standard syntax */
                   // }
                   /*</style>
                      </head>
                        <body>
                            <div id="list">
                            <ul>
                            <li>
                    <a href="/patient/${listData[i].userid}">${listData[i].firstname} ${listData[i].lastname}</a>
                    </li>`;


                }
                content += "</ul><br><br></body>"
                list.innerHTML = content;
            }
            else {
               list.innerHTML('Oops! Could not load all names!')
            }
        }
    };
    
    request.open('GET', '/home', true);
    request.send(null);
}
loadList();

