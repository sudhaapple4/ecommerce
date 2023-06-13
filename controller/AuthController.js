const { User } = require('../models/User');
const crypto = require('crypto');
const { sanitizeUser, sendMail } = require('../services/common');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
   
    try {
      /*const user = new User(req.body);
      const doc = await user.save();
      res.status(201).json(doc)*/
     const salt = crypto.randomBytes(16);
      crypto.pbkdf2(
        req.body.password,
        salt,
        310000,
        32,
        'sha256',
        async function (err, hashedPassword) {
          const user = new User({ ...req.body, password: hashedPassword, salt });
          const doc = await user.save();
          console.log('=========11 ',doc);
          req.login(sanitizeUser(doc), (err)=>{ //to call serializer and adds to session
              console.log('=========22err ',err)
              if(err) {res.status(400).json(err);}
              else {console.log('=========33 ',doc);res.status(201).json(sanitizeUser(doc));}
          })
          // res.status(201).json(sanitizeUser(doc));
        });
  
       /* req.login(sanitizeUser(doc), (err) => {
            // this also calls serializer and adds to session
            if (err) {
              res.status(400).json(err);
            } else {
              const token = jwt.sign(
                sanitizeUser(doc),
                process.env.JWT_SECRET_KEY
              );
              res
                .cookie('jwt', token, {
                  expires: new Date(Date.now() + 3600000),
                  httpOnly: true,
                })
                .status(201)
                .json({ id: doc.id, role: doc.role });
            }
          });
        }
      );*/
    } catch (err) {
      res.status(400).json(err);
    }
  };
exports.loginUser = async (req, res)=>{
    res.json(req.user)
}

/*exports.loginUser = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email }).exec();
      // const user = await User.find({})
      console.log(user,user.password.toString(),req.body.email)
      if (!user) {
        res.status(400).json({ message: "no such user exists" });
      } else if (user.password.toString() === req.body.password) {
        res.status(201).json({id:user.id,name:user.name,email:user.email,addresses:user.addresses});
      } else {
        res.status(400).json({ message: "Invalid User name / password" });
      }
    } catch (e) {
      res.status(400).json(e);
    }
  };*/

exports.logout = async (req, res) => {
  res
    .cookie('jwt', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200)
};

exports.checkAuth = async (req, res) => {
    console.log('from  checkAuth  ',req)
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

exports.resetPasswordRequest = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (user) {
    const token = crypto.randomBytes(48).toString('hex');
    user.resetPasswordToken = token;
    await user.save();

    // Also set token in email
    const resetPageLink =
      'http://localhost:3000/reset-password?token=' + token + '&email=' + email;
    const subject = 'reset password for e-commerce';
    const html = `<p>Click <a href='${resetPageLink}'>here</a> to Reset Password</p>`;

    // lets send email and a token in the mail body so we can verify that user has clicked right link

    if (email) {
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
};

exports.resetPassword = async (req, res) => {
  const { email, password, token } = req.body;

  const user = await User.findOne({ email: email, resetPasswordToken: token });
  if (user) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      'sha256',
      async function (err, hashedPassword) {
        user.password = hashedPassword;
        user.salt = salt;
        await user.save();
        const subject = 'password successfully reset for e-commerce';
        const html = `<p>Successfully able to Reset Password</p>`;
        if (email) {
          const response = await sendMail({ to: email, subject, html });
          res.json(response);
        } else {
          res.sendStatus(400);
        }
      }
    );
  } else {
    res.sendStatus(400);
  }
};