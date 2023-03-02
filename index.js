require("dotenv").config();
// const app = require("express")();
const express = require("express")
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5500;
const cors = require('cors');
// const html = require('html')


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


// const publicPath = path.join(__dirname, "public/contact")
// app.use(express.static(publicPath));

// app.get('/', (req, res) => {
//   res.render('contact.html')
// })


const nodemailer = require("nodemailer")
const mailgen = require('mailgen');
app.post('/register', (req, res) => {
  console.log(req.body);
  //lastname email phoneno msgbox phoneapp feature timeline numberscren
  const firstName = req.body.firstName;
  const lastName  = req.body.lastName;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const message = req.body.message;
  const inlineRadio = req.body.inlineRadio;
  const number_screen = req.body.number_screen;
  const timeline = req.body.timeline;
  const checkbox_feature = req.body.checkbox_feature
  const checkbox_language = req.body.checkbox_language


  let config = {
    service: 'gmail',
    auth: {
      user: process.env.USERSEMAIL,
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
      name:req.body.firstName, intro: "Email Successfully",
      table:{
        data:[
          {
            firstName: firstName,
            lastName:lastName,
            email: email,
            mobile: mobile,
            message:message,
            inlineRadio: inlineRadio,
            number_screen: number_screen,
            timeline:timeline,
            checkbox_feature:checkbox_feature,
            checkbox_language:checkbox_language
          
          }
        ]
      },
      outro: "Looking forward to do more business"
    }
  };
  const emailTemplate = mailGenerator.generate( emailBody);
  const emailText = mailGenerator.generatePlaintext(emailBody);

  //send email
  transporter.sendMail({
    from: req.body.email, // form email (client email)
    to: process.env.USERSEMAIL , //qamar sir(company email)
    subject: 'New User Registration',
    text: emailText,
    html: emailTemplate
  }, (error, info) => {
    if (error) {
      res.status(500).send('Email could not be sent');
      console.log(error);
    } else {
      res.status(200).send("Email sent Successfully")
      console.log('Email sent: ' + info.response);
      
    }
  });

  // res.redirect("contact.html")
})




app.listen(PORT, () => {
  console.log(`Server is Started on PORT ${PORT} .... :)`);
});

