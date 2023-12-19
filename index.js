const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const jwt = require('jsonwebtoken');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/userslist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  dob: String,
  isVerified: Boolean,
  verificationToken: String,
  password: String,
}, {
  timestamps: true,
  versionKey: false
});

const User = mongoose.model('User', userSchema);
app.post('/api/signup', async (req, res) => {
  try {
    const user = new User(req.body);
    user.isVerified = false;
    user.verificationToken = jwt.sign({ email: user.email }, 'your-secret-key');
    await user.save();

    sendVerificationEmail(user.email, user.verificationToken);

    res.json({ message: 'User registered successfully. Please check your email for verification.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/verify/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, 'your-secret-key');
    const userEmail = decoded.email;
    await User.updateOne({ email: userEmail }, { isVerified: true });
    res.redirect('http://localhost:4200/login');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const transporter = nodemailer.createTransport({
  
  service: 'gmail',
  auth: {
    user: 'newone@gmail.com',
     pass: 'New@2001',
  },
  tls: {
    rejectUnauthorized: false,
  },
});
function sendVerificationEmail(email, token) {
  const verificationLink = `http://localhost:3001/api/verify/${token}`;
  const mailOptions = {
    from: 'newone@gmail.com',
    to: email,
    subject: 'Email Verification',
    text: `Click the following link to verify your email: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
  
    if (error) {
      console.log('email error',error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

app.get('/api/getdata', async (req, res) => {

  try {

    let getData = await User.find({});
    if (getData.length > 0) {
      return res.status(200).json({
          status: true,
          data: getData,
          message: "Success."
      });
  } else {
      return res.status(200).json({
          status: true,
          message: "Something went wrong."
      });
  }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
