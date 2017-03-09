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
                // If page fails to load
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
        //Serial not working
           //Validation for firstname
           var regex = /^[a-zA-Z]*$/;
              if(firstname === '' || !(firstname.match(regex)) ){
                   document.getElementById('firstname').innerHTML = "Enter valid first name ";
                   document.registration.firstname.focus();
                   return false;
           }
           //check spaces between names
           if(firstname.match(' ')){
                   document.getElementById('firstname').innerHTML ='No Spaces';
                   document.registration.firstname.focus();
                   return false;
                }
                if(lastname.match(' ')){
                   document.getElementById('firstname').innerHTML = 'No Spaces';
                   document.registration.lastname.focus();
                   return false;
                }
          //Validation for lastname
            if(lastname === '' || !(lastname.match(regex)) ){
                   document.getElementById('lastname').innerHTML = "Enter valid last name";
                   document.registration.lastname.focus();
                   return false;
           }
           //Validation for dob
            if(dob === ''){
                   document.getElementById('DOB').innerHTML = "Enter birthday ";
                   document.registration.DOB.focus();
                   return false;
           }
         if(age <0 || age > 100)
                 {
                   document.getElementById('age').innerHTML = "Enter valid age ";
                   document.registration.age.focus();
                   return false;
                 }

  // Validation for gender
                  if(gender === "select"  )
         {
           document.getElementById('gender').innerHTML = "Enter valid gender ";
           document.registration.gender.focus();
           return false;
         }

//Validation for phone number
        if(phone.toString().length != 10)
         {
           document.getElementById('phone').innerHTML = "Enter valid number ";
           document.registration.phone.focus();
           return false;
         }
       
        

        request.open('POST','/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({firstname: firstname, lastname: lastname,age: age,dob:dob,gender: gender, phone: phone, randomtext: randomtext}));  
        register.value = 'Registering...';
    };
   }

// Make request for retrieving the list of patients
   function loadList () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var list = document.getElementById('list');
            if (request.status === 200) {
                var content = '<ul>';
                var listData = JSON.parse(this.responseText);
                for (var i=0; i< listData.length; i++) {
                    content += `<html> 
              <head>
                <meta name = "viewport" content = "width = device-width initial-scale=1" />
                            <li>
                    <a href="/patient/${listData[i].userid}">${listData[i].firstname} ${listData[i].lastname}</a>
                    </li>`;


                }
                content += "</ul><br><br></body>";
                list.innerHTML = content;
            }
            else {
               list.innerHTML('Oops! Could not load all names!');
            }
        }
    };
    
    request.open('GET', '/home', true);
    request.send(null);
}

// List pf patients loaded on home page load
loadList();

