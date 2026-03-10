require("dotenv").config();

const express          = require("express"),
      bodyParser       = require("body-parser"),
      mongoose         = require("mongoose"),
      passport         = require("passport"), 
      expressValidator = require("express-validator"),
      flash            = require("connect-flash"),
      session          = require("express-session"),
      mongoStore       = require("connect-mongo")(session),
      rateLimit        = require("express-rate-limit"),
      app              = express();


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/web_project" , {useNewUrlParser: true , useUnifiedTopology: true})
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log("MongoDB Connection Error:", err));
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// seed the db - uncomment to reset database
const Product = require('./models/product');

async function seedDatabase() {
    const count = await Product.countDocuments();
    if (count === 0) {
        let seedDB = require('./seeder');
        seedDB();
        console.log("Database seeded with products...");
    }
}
seedDatabase();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

//Express session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || "My Secret",
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({ 
        mongooseConnection: mongoose.connection,
        touchAfter: 24 * 3600 
    }).on('error', err => console.log('MongoStore Error:', err)),
    cookie: {maxAge: 180 * 60 * 1000}
}));



//Express Messages Middleware
app.use(flash());
app.use((req , res , next) => {
    res.locals.messages = require('express-messages')(req , res);
    next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

//passport config
require("./config/passport")(passport);
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

let users   = require("./routes/users"),
    menu    = require("./routes/menu"),
    booking = require("./routes/booking");

app.use((req , res , next) => {
  res.locals.user = req.user;
  res.locals.errors = req.errors;
  res.locals.session = req.session;
  next();
});

app.use("/users" , users);
app.use("" , menu);
app.use("" , booking);

//INDEX ROUTE
app.get("/" , (req , res) => {
  res.render("index");
});

// 404 Handler
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.session = req.session || null;
    res.status(404).render("404");
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.locals.user = req.user || null;
    res.locals.session = req.session || null;
    res.status(500).render("500", { error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SERVER STARTED ON PORT ${PORT}....`);
});