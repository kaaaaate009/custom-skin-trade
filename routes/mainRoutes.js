const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/mainController');
const { isGuest, isLoggedIn, checkExists } = require("../middlewares/auth");
const { logInLimiter } = require('../middlewares/rateLimiters');
const { validateSignUp, validateLogIn, validateResult } = require('../middlewares/validator');

const router = express.Router();

router.get('/', controller.index);

//GET /users/new: send html form for creating a new user account
router.get("/new", isGuest, controller.new);

//POST /users: create a new user account
router.post("/", isGuest, validateSignUp, validateResult, controller.create);

//GET /users/login: send html for logging in
router.get("/login", isGuest, controller.getUserLogin);

//POST /users/login: authenticate user's login
router.post("/login", logInLimiter, isGuest, validateLogIn, validateResult, controller.login);

//GET /users/profile: send user's profile page
router.get("/profile", isLoggedIn, controller.profile);

//router.post("/trade/:id",isLoggedIn, checkExists, controller.fetchAllAvailableTradeProducts);
router.post("/trade/:id",isLoggedIn, controller.fetchAllAvailableTradeProducts);

router.post('/trade/',isLoggedIn, controller.saveTransaction);

router.delete('/offer/:id',isLoggedIn, controller.deleteTradeOffer);

router.get('/offer/:id',isLoggedIn, controller.findOfferDetailsById);

router.post('/offer/',isLoggedIn, controller.acceptOffer);

//POST /users/logout: logout a user
router.get("/logout", isLoggedIn, controller.logout);

//GET /about
router.get('/about', controller.about);

//GET /contact
router.get('/contact', controller.contact);




module.exports = router;
