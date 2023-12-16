import * as userRoute from '../../routes/userRoutes.js';

var settings = {
    "url": "http://localhost:3000/login",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({
      "emailAddress": "narofficial08@gmail.com",
      "password": "Nr123456789@"
    }),
  };
  
  $.ajax(settings).done(function (response) {
    console.log(response);
  });