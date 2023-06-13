const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const server = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors=require('cors');
const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
const { createProduct } = require('./controller/ProductController');
const productsRouter=require('./routes/ProductRoute');
const brandsRouter=require('./routes/BrandRoute');
const categoryRoute=require('./routes/CategoryRoute');
const userRouter = require('./routes/UsersRouter');
const { User } = require('./models/User');
const authRouter = require('./routes/Auth');
const cartRouter=require('./routes/CartRoute');
const orderRouter = require('./routes/OrderRoute');
const { isAuth, sanitizeUser, cookieExtractor } = require('./services/common');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {};
opts.secretOrKey = 'secret';
dotenv.config();
const client = new MongoClient(process.env.MDB_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });


async function run() {
  try {
    // await client.connect();
    // await client.db("ecomm").command({ ping: 1 });
    mongoose.connect(process.env.MDB1_URL)
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch((err)=> console.log(err));

server.use(cors({
    exposedHeaders:['X-Total-Count']
}))
server.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
server.use(passport.initialize())
server.use(passport.session())
server.use(express.json());
server.use('/products',isAuth,productsRouter.router);
server.use('/category',isAuth,categoryRoute.router);
server.use('/brand',isAuth,brandsRouter.router);
server.use('/users',isAuth,userRouter.router);
server.use('/auth',authRouter.router);
server.use('/cart',isAuth,cartRouter.router);
server.use('/order',isAuth,orderRouter.router);


passport.use('local',new LocalStrategy({ usernameField: 'email' },
   async function(email, password, done) {
    const user = await User.findOne({ email: email });
    console.log('=================user ',user)
    if (!user) { return done(null, false,{ message: 'invalid credentials' }); }
    crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        'sha256',
        async function (err, hashedPassword) {
            //if (user.password.toString() !== password) { return done(null, false,{ message: 'invalid credentials' }); }
            if (!crypto.timingSafeEqual(user.password, hashedPassword)){ return done(null, false,{ message: 'invalid credentials' }); }
            console.log(user);
            return done(null, sanitizeUser(user)); 
        });
    }
  ));

  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
passport.use('jwt',new JwtStrategy(opts, function(jwt_payload, done) {
    console.log('jwt ====== ',jwt_payload)
    /*User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });*/
}));


  passport.serializeUser(function (user, cb) {
    console.log('serializeUser ',user)
    process.nextTick(function () {
      return cb(null, { id: user.id, role: user.role });
    });
  });
  
  // this changes session variable req.user when called from authorized request
  
  passport.deserializeUser(function (user, cb) {
    console.log('deserializeUser ',user)
    process.nextTick(function () {
      return cb(null, user);
    });
  });


server.listen(8000,()=> console.log('server started'))

server.get('/',(req,res)=> res.send('connected')) 
