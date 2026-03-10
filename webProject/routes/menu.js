require("dotenv").config();

const express = require("express"),
      router  = express.Router(),
      stripe  = require("stripe")(process.env.STRIPE_SECRET_KEY);
      
//Bring in User , product Model
let Product = require("../models/product"),
    Cart    = require("../models/cart"),
    Order   = require("../models/order");

//SHOW ROUTE
router.get("/menu" , async (req, res) => {
    try {
        let successMsg = req.flash('success')[0];
        let docs = await Product.find({});
        let productChunks = [];
        let chunkSize = 3;
        for(let i = 0; i < docs.length; i+=chunkSize){
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render("menu" , {products: productChunks , successMsg: successMsg , noMessage: !successMsg});
    } catch (err) {
        console.error(err);
        res.redirect("/");
    }
});

router.get("/add-to-cart/:id" , async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please login to add items to cart');
        req.session.oldUrl = '/menu';
        return res.redirect("/users/login");
    }
    
    try {
        let productId = req.params.id;
        let cart = new Cart(req.session.cart ? req.session.cart : {});
        let product = await Product.findById(productId);
        if(!product) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/menu');
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

function requireLogin(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please login to continue');
        req.session.oldUrl = req.originalUrl;
        return res.redirect("/users/login");
    }
    next();
}

router.get("/reduce/:id" , requireLogin, (req , res) => {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect("/cart");
});

router.get("/remove/:id" , requireLogin, (req , res) => {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect("/cart");
});


router.get("/cart" , requireLogin, (req, res) => {
    if(!req.session.cart) {
        return res.render("cart" , {products: null});
    } 
    let cart = new Cart(req.session.cart);
    res.render("cart" , {products: cart.generateArray() , totalPrice: cart.totalPrice});
});

router.get("/checkout" , isLoggedIn , (req , res) => {
    if(!req.session.cart) {
        return res.redirect("/cart");
    } 
    let cart = new Cart(req.session.cart);
    let errMsg = req.flash('error')[0];
    res.render("checkout" , {total: cart.totalPrice , errMsg: errMsg , noError: !errMsg});
});

router.post("/checkout" , isLoggedIn , async (req, res) => {
    try {
        if(!req.session.cart) {
            return res.redirect("/cart");
        } 
        let cart = new Cart(req.session.cart);

        let order = new Order({
            user: req.user._id,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            phone: req.body.phone,
            paymentId: "COD-" + Date.now(),
            status: "Confirmed",
            orderDate: new Date()
        });

        await order.save();
        req.flash('success' , 'Order placed successfully! Order ID: ' + order._id);
        req.session.cart = null;
        res.redirect('/menu');
    } catch (err) {
        console.error(err);
        req.flash('error' , err.message);
        return res.redirect("/checkout");
    }
});

module.exports = router;

function isLoggedIn(req , res , next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error" , "You first need to log in");
    req.session.oldUrl = req.url;
    res.redirect("/users/login");
}
