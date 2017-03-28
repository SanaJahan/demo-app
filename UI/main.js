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
                  document.location.href = "/";
                }
                // If page fails to load
              else if(request.status === 403){
                  alert('Could not register the user');
                  register.value = 'Register';
          }
          else if(request.status === 503){
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
                   document.getElementById('firstname').placeholder = "Enter valid first name ";
                   document.registration.firstname.focus();
                   return false;
           }
           //check spaces between names
           if(firstname.match(' ')){
                   alert('No Spaces');
                   document.registration.firstname.focus();
                   return false;
                }
                if(lastname.match(' ')){
                   alert('No Spaces');
                   document.registration.lastname.focus();
                   return false;
                }
          //Validation for lastname
            if(lastname === '' || !(lastname.match(regex)) ){
                   document.getElementById('lastname').placeholder = "Enter valid last name";
                   document.registration.lastname.focus();
                   return false;
           }
           //Validation for dob
            if(dob === ''){
                   document.getElementById('DOB').placeholder = "Enter birthday ";
                   document.registration.DOB.focus();
                   return false;
           }
         if(age <0 || age > 100 || age === '')
                 {
                   alert("Enter valid birthday ");
                   document.registration.DOB.focus();
                   return false;
                 }

  // Validation for gender
                  if(gender === "select"  )
         {
           alert("Enter valid gender ");
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
        request.send(JSON.stringify({firstname: firstname, lastname: lastname,dob:dob,age: age,gender: gender, phone: phone, randomtext: randomtext}));  
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
// Make request to update the information 
var deleted = document.getElementById("delete");

 if (deleted != undefined) {
 
    deleted.onclick = function () {
       if(confirm('Delete record?')){
        // Create a request object
         var id = document.getElementById("delete").value;
         console.log(id);
        var request = new XMLHttpRequest();
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              if (request.status === 200) {
                    window.location.href = "/";

                }
                // If page fails to load
              else if(request.status === 403){
                  alert('Could not delete the user');
          }
          else if(request.status === 503){
                  alert('Could not delete the user');
                }
          }
           
        };
        // Make the request
        request.open('DELETE', window.location.protocol+'//'+window.location.host+'/delete/'+id, true);
        request.send(null);

   }
 }
}
// Update form
var unUpdated = document.getElementById("updated");
if(unUpdated != undefined){
  unUpdated.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              if (request.status === 200) {
                    var info = JSON.parse(this.responseText);
                     window.location.href = "/update/"+id;
                     var id=document.getElementById("update").value;
                     document.getElementById('firstname').value = '${list.firstname}';
                     document.getElementById('lastname').value= '${list.lastname}';
                     document.getElementById('age').value= '${list.age}';
                     document.getElementById('dob').value= '${list.dob}';
                     document.getElementById('gender').value= '${list.gender}';
                     document.getElementById('phone').value= '${list.phone}';
                     document.getElementById('random_text').value= '${list.randomtext}';

                }
                // If page fails to load
              else if(request.status === 403){
                  alert('Could not update the user');
          }
          else if(request.status === 503){
                  alert('Could not update the user');
                }
          }
        };

        request.open('GET', window.location.protocol+'//'+window.location.host+'/update/'+id, true);
        request.send(null);

  };
}



// Updating and POsting in the form
var updated = document.getElementById("update");
if(updated != undefined){
  updated.onclick = function(){
    var id = document.getElementById("update").value;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
               if (request.status === 200) {
                  document.location.href = "/patient/"+id;
                }
                // If page fails to load
              else if(request.status === 403){
                  alert('Could not update the user');
                  update.value = 'Update';
          }
          else if(request.status === 503){
                  alert('Could not update the user');
                  update.value = 'Update';
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
           //Validation for firstname
           var regex = /^[a-zA-Z]*$/;
              if(firstname === '' || !(firstname.match(regex)) ){
                   document.getElementById('firstname').placeholder = "Enter valid first name ";
                   document.registration.firstname.focus();
                   return false;
           }
           //check spaces between names
           if(firstname.match(' ')){
                   alert('No Spaces');
                   document.registration.firstname.focus();
                   return false;
                }
                if(lastname.match(' ')){
                   alert('No Spaces');
                   document.registration.lastname.focus();
                   return false;
                }
          //Validation for lastname
            if(lastname === '' || !(lastname.match(regex)) ){
                   document.getElementById('lastname').placeholder = "Enter valid last name";
                   document.registration.lastname.focus();
                   return false;
           }
           //Validation for dob
            if(dob === ''){
                   document.getElementById('DOB').placeholder = "Enter birthday ";
                   document.registration.DOB.focus();
                   return false;
           }
         if(age <0 || age > 100 || age === '')
                 {
                   alert("Enter valid birthday ");
                   document.registration.DOB.focus();
                   return false;
                 }

  // Validation for gender
                  if(gender === "select"  )
         {
           alert("Enter valid gender ");
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

        //request.open('POST','/patient/update/'+id, true);
        request.open('POST', window.location.protocol+'//'+window.location.host+'/patient/update/'+id, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({firstname: firstname, lastname: lastname,dob: dob,age: age,gender: gender, phone: phone, randomtext: randomtext})); 
    };
   }


// List of patients loaded on home page load
loadList();

