const { validationResult } = require('express-validator');
const model = require("../models/user");
const Trade = require('../models/item');
const watchList = require('../models/watch');
const tradeD = require('../models/tradeData');

exports.index = (req, res) => {
  res.render('./');
};

exports.new = (req, res) => {
  res.render("./users/new");
};

exports.create = (req, res, next) => {

  let user = new model(req.body); //create a new story 
  if (user.email)
    user.email = user.email.toLowerCase();
  user
    .save() //insert the document to the database
    .then((user) => res.redirect("/users/login"))
    .catch((err) => {
      if (err.name === "ValidationError") {
        req.flash("error", err.message);
        return res.redirect("/users/new");
      }

      if (err.code === 11000) {
        req.flash("error", "Email has been used");
        return res.redirect("/users/new");
      }

      next(err);
    });
};

exports.getUserLogin = (req, res, next) => {
  res.render("./users/login");
};

exports.login = (req, res, next) => {

  let email = req.body.email;
  if (email)
    email = email.toLowerCase();
  let password = req.body.password;
  model
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("wrong email address");
        req.flash("error", "wrong email address");
        res.redirect("/users/login");
      } else {
        user.comparePassword(password).then((result) => {
          if (result) {
            req.session.user = user._id;
            req.flash("success", "You have successfully logged in");
            res.redirect("/users/profile");
          } else {
            req.flash("error", "wrong password");
            res.redirect("/users/login");
          }
        });
      }
    })
    .catch((err) => next(err));
};

exports.profile = (req, res, next) => {
  let headerValue = 'PROFILE';
  let id = req.session.user;
  let name = req.session.userName;

  Trade.find({ created_by: id })
    .then(trade_items => {
      watchList.find({ user_id: id }).populate('trade_item_id', 'item_category item_name status')
        .then(watchListData => {
          console.log(watchListData);
          tradeD.find({
            "$or": [{
              "accepter_user_id": id
            }, {
              "creater_user_id": id
            }]
          })
            .populate('trade_with', 'item_category item_name created_by')
            .populate('trade_item', 'item_category item_name created_by')
            .then(currentTradingData => {
              res.render("./users/profile", { id, name, headerValue, trade_items, watchListData, currentTradingData });
            })
            .catch(err => next(err));

        })
        .catch(err => next(err));

    })
    .catch(err => next(err));
};

exports.fetchAllAvailableTradeProducts = (req, res, next) => {
  let headerValue = 'TRADE PRODUCTS';
  let id = req.session.user;
  let tradeId = req.params.id;
  let body = req.body;
  let accepter_user_id = body.accepter_user_id;

  Trade.find({ created_by: id, status: "1" })
    .then(productsData => {
      res.render('users/selectTrade', { accepter_user_id, tradeId, headerValue, productsData });
    })
    .catch(err => next(err));

};

exports.saveTransaction = (req, res, next) => {
  let body = new tradeD(req.body);
  body.creater_user_id = req.session.user;
  body.status = 1;

  // Validate the accepter_user_id field
  if (!body.accepter_user_id) {
    let err = new Error('Accepter user ID is required');
    err.status = 400;
    return next(err);
  }

  body.save()
    .then(() => {
      Trade.updateMany(
        {
          _id: {
            $in: [body.trade_item, body.trade_with]
          }
        },
        {
          $set: {
            status: "2"
          }
        }
      )
        .then(() => {
          req.flash('success', 'Trade Request Sent Successfully');
        })
        .catch(err => next(err));
      res.redirect('/users/profile');
    })
    .catch(err => next(err));
};


exports.deleteTradeOffer = (req, res, next) => {
  let id = req.params.id;
  tradeD.findByIdAndDelete(id, { useFindAndModify: false })
    .then(data => {
      if (data) {
        mobile.updateMany(
          {
            _id: {
              $in: [data.trade_item, data.trade_with]
            }
          },
          {
            $set: {
              status: "1"
            }
          }
        )
          .then(() => {
            req.flash('success', 'Trade Offer Deleted Successfully');
            res.redirect('/users/profile');
          })
          .catch(err => next(err));
      } else {
        let err = new Error("Cannot cancel the offer");
        err.status = 404;
        next(err);
      }
    })
    .catch(err => next(err));
};

exports.findOfferDetailsById = (req, res, next) => {
  let id = req.params.id;
  let currentUser = req.session.user;
  tradeD.findById(id)
    .populate('trade_with', 'item_category item_name image')
    .populate('trade_item', 'item_category item_name image')
    .then(data => {
      let headerValue = 'MANAGE OFFER';
      res.render('users/offer', { data, headerValue, currentUser });
    })
    .catch(err => next(err));
};

exports.acceptOffer = (req, res, next) => {
  let offerId = req.body.offer_id;
  tradeD.findByIdAndUpdate(offerId, { "status": 2 }, { new: true })
    .then(data => {
      console.log(data);
      Trade.updateMany(
        {
          _id: {
            $in: [data.trade_item, data.trade_with]
          }
        },
        {
          $set: {
            status: "3"
          }
        }
      )
        .then(e => {
          console.log(e);
          res.redirect('/users/profile');
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    else res.redirect("/");
  });
};


exports.about = (req, res) => {
  res.render('./about');
};

exports.contact = (req, res) => {
  res.render('./contact');
};