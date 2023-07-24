//require modules
const express = require('express');
const morgan = require('morgan');
const { query } = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const tradeRoutes = require('./routes/tradeRoutes');
const mainRoutes = require('./routes/mainRoutes');


//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/milestone4',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        //start the server
        app.listen(port, host, () => {
            console.log('The server is running at port', port);
        });
    })
    .catch(err => console.log(err.message));

//mount middleware 
app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongoUrl: 'mongodb://127.0.0.1:27017/milestone4' }),
        cookie: { maxAge: 60 * 60 * 1000 }
    })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user || null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));


app.use('/', mainRoutes);
app.use('/about', mainRoutes);
app.use('/contact', mainRoutes);
app.use('/trade', tradeRoutes);
app.use('/users', mainRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate the url - ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if (!err.status) {
        err.status = 500;
        err.message = ('Internal Server Error');
    }
    res.status(err.status);
    res.render('error', { error: err });
});
