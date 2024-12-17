//require modules
const express = require('express');
const morgan = require('morgan');
const { query } = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const tradeRoutes = require('../routes/tradeRoutes');
const mainRoutes = require('../routes/mainRoutes');


//create app
const app = express();

// Configure app
let port = process.env.PORT || 3000; // Port from environment variable
let host = '0.0.0.0'; // Bind to all interfaces
let mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/skintradeapp';
let sessionSecret = process.env.SESSION_SECRET || 'ajfeirf90aeu9eroejfoefj';
app.set('view engine', 'ejs');

// MongoDB Connection
console.log(`Attempting to connect to MongoDB at: ${mongoUrl}`);
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin'
})
    .then(() => {
        console.log('MongoDB connection established successfully.');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit process if DB fails
    });

// Start the server after MongoDB connection
app.listen(port, host, () => {
    console.log(`The server is running at http://${host}:${port}`);
});

// Mount middleware
app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: mongoUrl,
            crypto: { secret: sessionSecret },
            autoRemove: 'native'
        }),
        cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
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

app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Server is running.',
        mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

/*
app.get('/', (req, res) => {
    res.status(200).send('Server is up and running!');
});
*/

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
