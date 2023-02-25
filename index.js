require("dotenv").config();
// const app = require("express")();
const express = require("express")
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 9000;
const cors = require('cors');


//bodyParser connection
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//using cors
app.use(cors());

//access to content header
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept, Authorization"
  );
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST,PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

var allowlist = ['http://example1.com', 'http://example2.com']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.get('/', (req, res) => {
  res.render('contact.html')
})


const nodemailer = require("nodemailer")
const mailgen = require('mailgen');
app.post('/register', (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  let config = {
    service: 'gmail',
    auth: {
      user: process.env.USEREMAIL,
      pass: process.env.USERPASSWORD
    }
  }
  let transporter = nodemailer.createTransport(config);

  let mailGenerator = new mailgen({
    theme: "default",
    product: {
      name: 'My App',
      link: 'https://myapp.com/'
    }
    
  });
 
  const emailBody = {
    body: {
      name: name,
      email: email,
      password: password
    }
  };
  const emailTemplate = mailGenerator.generate( emailBody);
  const emailText = mailGenerator.generatePlaintext(emailBody);

  //send email
  transporter.sendMail({
    from: req.body.email, // form email (client email)
    to:`qamarkhan@namlsoft.com ` , //qamar sir(company email)
    subject: 'New User Registration',
    text: emailText,
    html: emailTemplate
  }, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.redirect('contact.html')

})




app.listen(PORT, () => {
  console.log(`Server is Started on PORT ${PORT} .... :)`);
});

