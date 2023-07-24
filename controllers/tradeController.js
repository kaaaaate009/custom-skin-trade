const moment = require("moment");
const model = require('../models/item');
const watchList = require('../models/watch');
const tradeD = require('../models/tradeData');

exports.index = (req, res, next) => {
    model.find()
        .then(trade_items => res.render('./trade/trade', { trade_items }))
        .catch(err => next(err));
};

exports.new = (req, res) => {
    res.render('./trade/newTrade');
};

exports.create = (req, res, next) => {
    let trade_items = new model(req.body); // create a new story document
    trade_items.created_by = req.session.user;
    trade_items.status = 1;
    trade_items.save() // insert the document to the database
        .then(trade_items => res.redirect('/trade'))
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
            next(err);
        });
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    let headerValue = 'PRODUCT DETAIL';
    //model.findById(id).populate("created_by", "firstName lastName")
    model.findById(id)
        .then(sknData => {
            if (sknData) {
                res.locals.moment = moment;

                watchList.findOne({ trade_item_id: id, user_id: req.session.user })
                    .then((watchListData => {
                        res.render('./trade/showSkin', { sknData, headerValue, watchListData });
                    }))
                    .catch(err => next(err));
            } else {
                let err = new Error('Cannot find trade data with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

exports.edit = (req, res, next) => {
    let id = req.trades

    model.findById(id).then(trade_items => {
        if (trade_items) {
            return res.render('./trade/editSkinInfo', { trade_items });
        } else {
            let err = new Error('Cannot find story with id - ' + id);
            err.status = 404;
            next(err);
        }
    })
        .catch(err => next(err));
};

exports.update = (req, res, next) => {
    let id = req.params.id;
    trade_items.fav_skin = !trade_items.fav_skin;

    model.findByIdAndUpdate(id, skin, { useFindAndModify: false, runValidators: true })
        .then(skin => {
            if (skin) {
                res.redirect('/trade/' + id);
            } else {
                let err = new Error('Cannot find skin with id - ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
            next(err);
        });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;

    model.findByIdAndDelete(id, { useFindAndModify: false })
        .then(skin => {
            if (skin) {
                //res.redirect('/trade');
                watchList.deleteMany({ trade_item_id: id })
                    .then((skin1) => {

                        tradeD.find({
                            "$or": [{
                                "trade_with": id
                            }, {
                                "trade_item": id
                            }]
                        })
                            .then(val => {
                                console.log(val[0]);
                                var updateId;
                                if (val[0].trade_with == id) {
                                    updateId = val[0].trade_item;
                                } else if (val[0].trade_item == id) {
                                    updateId = val[0].trade_with;
                                }
                                console.log("THE ID TO BE UPDATED AS 1" + updateId);

                                tradeD.findByIdAndDelete(val[0]._id)
                                    .then(() => {
                                        model.updateOne({ _id: updateId }, { $set: { "status": 1 } })
                                            .then(() => res.redirect('/trade'))
                                            .catch(err => next(err));
                                    })
                                    .catch(err => next(err));
                            })
                            .catch(err => next(err));

                    }).catch(err => next(err));
            } else {
                let err = new Error('Cannot find skin with id - ' + id);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
};


exports.addWatchList = (req, res, next) => {
    let id = req.params.id;
    let body = new watchList();
    body.user_id = req.session.user;
    body.trade_item_id = id;

    body.save()
        .then((data) => {
            req.flash('success', 'Trade Item Added To Watch List');
            res.redirect('/users/profile');
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
            next(err);
        });
};

exports.removeWatchList = (req, res, next) => {
    let id = req.params.id;
    watchList.deleteOne({ _id: id })
        .then(() => {
            req.flash('error', 'Trade Item Removed From Watch List');
            res.redirect('/users/profile');
        })
        .catch(err => next(err));
}

/*
exports.delete = (req, res, next) => {
    let id = req.params.id;

    model.findByIdAndDelete(id, { useFindAndModify: false })
        .then(skin => {
            if (skin) {
                res.redirect('/trade');
            } else {
                let err = new Error('Cannot find skin with id - ' + id);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
};


exports.watchadd = (req, res, next) => {
    let created_by = req.session.user;
    let id = req.params.id;
    let status = req.body.status;

    model.findById(id)
        .then(trade_items => {
            if (trade_items) {
                if (trade_items.created_by == created_by) {
                    let err = new Error('This trade is created by you, please visit profile for your skins');
                    err.status = 401;
                    return next(err);
                } else {
                    Watchlist.updateOne({ trade_items: id, created_by: created_by },
                        { $set: { trade_items: id, created_by: created_by, status: status } },
                        { upsert: true })
                        .then(watchlist => {
                            if (watchlist) {
                                if (watchlist.upserted) {
                                    req.flash('success', 'Successfully added to Watchlist');
                                } else {
                                    req.flash('success', 'Successfully updated Watchlist');
                                }
                                res.redirect('/users/profile');
                            } else {
                                req.flash('error', 'There is some problem in adding to Watchlist');
                                res.redirect('back');
                            }
                        })
                        .catch(err => {
                            if (err.name === 'ValidationError') {
                                req.flash('error', err.message);
                                res.redirect('back');
                            } else {
                                next(err);
                            }
                        });
                }
            } else {
                let err = new Error('Cannot find a model with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));

};

exports.watchdelete = (req, res, next) => {
    let id = req.params.id;
    Watchlist.findByIdAndDelete(id, { useFindAndModify: false })
        .then(watchlist => {
            if (watchlist) {
                req.flash('success', 'Skin removed from watchlist');
                res.redirect('/users/profile');
            } else {
                let err = new Error('Cannot find an skin with id ' + id);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
};
*/