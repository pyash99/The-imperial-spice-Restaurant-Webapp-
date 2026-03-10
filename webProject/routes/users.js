require("dotenv").config();

const express  = require("express"),
      router   = express.Router(),
      bcrypt   = require("bcryptjs"),
      passport = require("passport")

//Bring in User Model
let User  = require("../models/user"),
    Order = require("../models/order"),
    Cart  = require("../models/cart");

//profile page
router.get("/profile" , isLoggedIn , async (req, res) => {
    try {
        let orders = await Order.find({user: req.user._id}).populate('user');
        var cart;
        orders.forEach((order) => {
            cart = new Cart(order.cart);
            order.items = cart.generateArray()
        });
        res.render('profile.ejs' , {orders: orders , user: req.user});
    } catch (err) {
        console.error(err);
        res.write("ERROR!");
    }
});

//Logout
router.get("/logout" , (req , res) => {
    req.logout();
    res.redirect("/");
});

router.use("/" , notLoggedIn , (req , res , next) => {
    next();
});

//Register Form
router.get("/register" , (req , res) => {
    res.render("register");
});

//Register Process
router.post("/register" , async (req , res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const password2 = req.body.password2;

        req.checkBody('name' , 'Name is required').notEmpty();
        req.checkBody('email' , 'Email is required').notEmpty();
        req.checkBody('email' , 'Email is not valid').isEmail();
        req.checkBody('username' , 'Username is required').notEmpty();
        req.checkBody('password' , 'Password is required').notEmpty();
        req.checkBody('password2' , 'Passwords do not match').equals(req.body.password);

        let errors = req.validationErrors();

        if(errors) {
            return res.render('register' , { errors: errors });
        }

        let existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.render('register' , { errors: [{ msg: 'User already exists' }] });
        }

        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash;
        
        await newUser.save();
        req.flash('success' , 'You are now registered and can login');
        res.redirect("/users/login");
    } catch (err) {
        console.error(err);
        res.render('register' , { errors: [{ msg: 'Error registering user' }] });
    }
});

//login form
router.get("/login" , (req , res) => {
    res.render("login");
});

//login process
router.post("/login" , (req , res , next) => {
    passport.authenticate("local" , {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true 
    })(req , res , next);
});

module.exports = router;

function isLoggedIn(req , res , next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error" , "You first need to log in");
    res.redirect("/users/login");
}

function notLoggedIn(req , res , next) {
    if (!req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}
