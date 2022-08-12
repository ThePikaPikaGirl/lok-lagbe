const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const v4 = require("uuid4");
const jwt = require("jsonwebtoken");
const util = require("util");
const nodemailer = require("nodemailer");
const markdown = require('nodemailer-markdown').markdown;
const { google } = require("googleapis");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const adminApp = require('firebase-admin/app');
const adminAuth = require('firebase-admin/auth');
const adminFirestore = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
adminApp.initializeApp({
  credential: adminApp.cert(require("./confidential/serviceAcc.json"))
});


const db = adminFirestore.getFirestore();






require("dotenv").config();


console.clear();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running...",
    status: "success",
    statusCode: 200,
  });
});


app.post('/api/auth/create_token', (req, res) => {
  let user = req.body.user;

  if (user) {
    let payload = {
      user,
      service: "JWTSessionize",
    }

    let token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      message: "Token generated successfully!",
      status: "success",
      statusCode: 200,
      response: {
        token,
      },
    });
  } else {
    res.status(403).json({
      message: "User must not be undefined!",
      status: "unauthorized",
      statusCode: 403,
    });
  }
});

app.post('/api/auth/check_token', async (req, res) => {
  let token = req.body.token;
  let isValid = false;
  const jwtVerifyAsync = util.promisify(jwt.verify);

  if (token) {
    try {
      let decoded = await jwtVerifyAsync(token, process.env.JWT_SECRET);

      if (decoded.exp < new Date().getTime() / 1000) {
        isValid = false;
      } else {
        isValid = true;
      }
  
      res.status(200).json({
        message: "Token validated successfully!",
        status: "success",
        statusCode: 200,
        response: {
          isValid,
        },
      });
      
    } catch (e) {
      res.status(403).json({
        message: "Token must have expired!",
        status: "unauthorized",
        statusCode: 403,
        response: {
          isValid,
        },
      });
    }
  } else {
    res.status(403).json({
      message: "Token must not be undefined!",
      status: "unauthorized",
      statusCode: 403,
    });
  }
});

const OAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REFRESH_TOKEN
);


OAuth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

app.post("/mail", async (req, res) => {
  const {
      destEmail,
      subject,
      message
  } = req.body;

  try {
    const accessToken = await OAuth2Client.getAccessToken();
    
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_ADDR,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: process.env.OAUTH_ACCESS_TOKEN
      }
    });

    transport.use('compile', markdown())

    const mailOptions = {
      from: `LokLagbe Team 📨 <${process.env.EMAIL_ADDR}>`,
      to: destEmail,
      subject,
      markdown: message
    }

    const result = await transport.sendMail(mailOptions);

    console.log(result);

    res.status(200).json({
      message: "Mailed successfully!",
      status: "success",
      statusCode: 200
    });
      
  } catch (error) {
    console.log(error);
    
    res.status(404).json({
      message: "Email could not be sent!",
      status: "unknown",
      statusCode: 404,
    });
  }
});


app.post(
  "/cv_upload",
  multer({
    dest: "public/cvs/",
  }).single("file"),
  (req, res) => {
    let newFileName = v4() + path.extname(req.file.originalname);

    fs.rename(
      path.join(__dirname, "../public/cvs", req.file.filename),
      path.join(__dirname, "../public/cvs", newFileName),
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    // const baseUrl = process.env.BASE_URL;

    res.status(200).json({
      message: "File uploaded successfully!",
      status: "success",
      statusCode: 200,
      response: {
        fileName: req.file.originalname,
        url: `/cvs/${newFileName}`,
      },
    });
  },
  (err, req, res, next) => {
    console.log(err);
    res.status(400).json({
      message: "Error while uploading file!",
      status: "error",
      statusCode: 400,
    });
  }
);


app.get("/totp_setup", async (req, res) => {
  const spkezSecret = speakeasy.generateSecret({
    name: "Lok Lagbe"
  });

  qrcode.toDataURL(spkezSecret.otpauth_url, (err, data) => {
    if (err){
      console.log(err);
      res.status(400).json({
        message: "Error while setting up TOTP!",
        status: "error",
        statusCode: 400,
      });
    }

    res.status(200).json({
      message: "Setup TOTP successful!",
      status: "success",
      statusCode: 200,
      response: {
        dataUrlQR: data,
        asciiLocator: spkezSecret.ascii
      },
    });
  });
});  


app.post("/totp_verify", async (req, res) => {
  const {
    secret,
    token
  } = req.body;

  try {
    const isVerified = await speakeasy.totp.verify({
      secret,
      encoding: "ascii",
      token
    });

    res.status(200).json({
      message: "Setup TOTP successful!",
      status: "success",
      statusCode: 200,
      response: {
        isVerified
      },
    });
  } catch (e) {
    console.log(e);

    res.status(400).json({
      message: "Error while verifying TOTP!",
      status: "error",
      statusCode: 400,
    });
  }
  
});

app.get("/users/get-workers-data", async (req, res) => {
  const usersRef = db.collection('users');

  try {
    const allWorkersRes = await usersRef.where('role', '==', "worker").get();
    
    if(allWorkersRes.empty) {
      const data = [];
      
      res.status(200).json({
        message: "Fetch was successful!",
        status: "success",
        statusCode: 200,
        response: {
          data
        },
      });
    } else {
      const data = [];

      allWorkersRes.forEach((doc) => {
        data.push({
          id: doc.id,
          data: doc.data()
        });
      })
      
      
      res.status(200).json({
        message: "Fetch was successful!",
        status: "success",
        statusCode: 200,
        response: {
          data
        },
      });
    }
  } catch (e) {
    console.log(e);

    res.status(400).json({
      message: "Error while fetching workers data!",
      status: "error",
      statusCode: 400,
    });
  }
});

app.get("/users/get-unapproved-workers-data", async (req, res) => {
  const usersRef = db.collection('users');

  try {
    const allWorkersRes = await usersRef
      .where("role", "==", "worker")
      .where("isApproved", "==", false)
      .get();
    
    if(allWorkersRes.empty) {
      const data = [];
      
      res.status(200).json({
        message: "Got empty data, but still fetch was successful!",
        status: "success",
        statusCode: 200,
        response: {
          data
        },
      });
    } else {
      const data = [];

      allWorkersRes.forEach((doc) => {
        data.push({
          id: doc.id,
          data: doc.data()
        });
      })
      
      
      res.status(200).json({
        message: "Fetch was successful!",
        status: "success",
        statusCode: 200,
        response: {
          data
        },
      });
    }
  } catch (e) {
    console.log(e);

    res.status(400).json({
      message: "Error while fetching workers data!",
      status: "error",
      statusCode: 400,
    });
  }
});

app.get("/users/get-approved-workers-data", async (req, res) => {
  const usersRef = db.collection('users');

  try {
    const allWorkersRes = await usersRef
      .where("role", "==", "worker")
      .where("isApproved", "==", true)
      .get();
    
    if(allWorkersRes.empty) {
      const data = [];
      
      res.status(200).json({
        message: "Got empty data, but still fetch was successful!",
        status: "success",
        statusCode: 200,
        response: {
          data
        },
      });
    } else {
      const data = [];

      allWorkersRes.forEach((doc) => {
        data.push({
          id: doc.id,
          data: doc.data()
        });
      })
      
      
      res.status(200).json({
        message: "Fetch was successful!",
        status: "success",
        statusCode: 200,
        response: {
          data
        },
      });
    }
  } catch (e) {
    console.log(e);

    res.status(400).json({
      message: "Error while fetching workers data!",
      status: "error",
      statusCode: 400,
    });
  }
});


app.post("/users/approve-worker", async (req, res) => {
  const {
    id
  } = req.body;

  if(!id || id.length < 1) {
    res.status(400).json({
      message: "ID provided must not be empty or undefined!",
      status: "error",
      statusCode: 400,
    });
  } else {
    try {
      const docRef = db.collection('users').doc(id);

      await docRef.update({
        isApproved: true
      });

      res.status(200).json({
        message: "Worker approved successfully!",
        status: "success",
        statusCode: 200,
        response: true,
      });
    } catch(e) {
      console.log(e);
      
      res.status(400).json({
        message: "Error while approving the worker!",
        status: "error",
        statusCode: 400,
      });
    }
  }
});


app.post("/users/reject-worker", async (req, res) => {
  const {
    id
  } = req.body;

  if(!id || id.length < 1) {
    res.status(400).json({
      message: "ID provided must not be empty or undefined!",
      status: "error",
      statusCode: 400,
    });
  } else {
    try {
      const docRef = db.collection('users').doc(id);

      const doc = await docRef.get()

      const data = doc.data()

      fs.unlink(path.join(__dirname, "../public" + data.cvURL), (err) => {
        if(err) console.log(err);
      });

      await docRef.delete();

      const user = await adminAuth
        .getAuth()
        .getUserByEmail(id);

      const userJSON = user.toJSON();

      await adminAuth
        .getAuth()
        .deleteUser(userJSON.uid);

      res.status(200).json({
        message: "Worker rejected successfully!",
        status: "success",
        statusCode: 200,
        response: true,
      });
    } catch(e) {
      console.log(e);
      
      res.status(400).json({
        message: "Error while rejecting the worker!",
        status: "error",
        statusCode: 400,
      });
    }
  }
});


app.post("/encode", async (req, res) => {
  const {
    payload,
    secret
  } = req.body;

  if(payload && secret) {
    let token = jwt.sign(payload, secret);
    
    res.status(200).json({
      message: "Token generated successfully!",
      status: "success",
      statusCode: 200,
      response: {
        token,
      },
    });
  } else {
    res.status(403).json({
      message: "Payload and secret must not be undefined!",
      status: "unauthorized",
      statusCode: 403,
    });
  }
});


app.post("/decode", async (req, res) => {
  const {
    token,
    secret
  } = req.body;

  if(token && secret) {
    const decoded = jwt.verify(token, secret);
    
    res.status(200).json({
      message: "Decoded successfully!",
      status: "success",
      statusCode: 200,
      response: {
        decoded,
      },
    });
  } else {
    res.status(403).json({
      message: "Token and secret must not be undefined!",
      status: "unauthorized",
      statusCode: 403,
    });
  }
});


app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
