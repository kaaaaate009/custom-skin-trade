//const story = require('../models/item');
const model = require('../models/item');


exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};


exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
};


exports.isAuthor = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
        .then(trade_items => {
            if (trade_items) {
                if (trade_items.created_by == req.session.user) {
                    return next();
                } else {
                    let err = new Error('Unauthorized to access the resource');
                    err.status = 401;
                    return next(err);
                }
            }
        })
        .catch(err => next(err));
};


exports.checkExist = (req,res,next) => {
    let id = req.params.id;
    model.findById(id)
    .then(value => {
        if(value){
            if(value.created_by != req.session.user){
                return next();
            }else{
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        }else{
            let err = new Error('Unauthorized to access the resource');
            err.status = 401;
            return next(err);
        }
    })
    .catch(err => next(err));
};