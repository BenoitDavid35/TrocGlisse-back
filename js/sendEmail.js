//https://myaccount.google.com/u/1/lesssecureapps?pli=1&pageId=none
//might need to go on above link to solve the google security issue on email login with the app.
var nodemailer = require('nodemailer');

function sendAccountCreationMail(mailOptions,callback){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'trocglisse@gmail.com',
      pass: 'Trocglisse+5665*'
    }
  });

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      callback(error,null);
    } else {
      console.log('Email sent: ' + info.response);
      callback(null,'TRUE');
    }
  });
}

exports.sendAccountCreationMail = sendAccountCreationMail;
