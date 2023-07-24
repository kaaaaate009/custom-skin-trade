const express = require('express');
const controller = require('../controllers/tradeController')
const { isLoggedIn, isAuthor } = require("../middlewares/auth");
const { validateId } = require("../middlewares/validator");

const router = express.Router();

//GET /trades: send all trades to the user

router.get("/", controller.index);

//GET /trades/new: send html form for creating a new trade

router.get("/new", isLoggedIn, controller.new);

//POST /trades: create a new trade

router.post("/", isLoggedIn, controller.create);

//GET /trades/:id: send details of trade identified by id
router.get("/:id", validateId, controller.show);

//GET /trades/:id/edit: send html form for editing an exising trade
router.get("/:id/edit", validateId, isLoggedIn, isAuthor, controller.edit);

//PUT /trades/:id: update the trade identified by id
router.put("/:id", validateId, isLoggedIn, isAuthor, controller.update);

//DELETE /trades/:id, delete the trade identified by id
router.delete("/:id", validateId, isLoggedIn, isAuthor, controller.delete);

//POST to add the trade item to the watch list of the current user
router.post('/:id/watch', validateId, isLoggedIn, controller.addWatchList);

//POST to remove from the trades watch list of the current user 
router.post('/:id/unwatch', validateId, isLoggedIn, controller.removeWatchList);

module.exports = router;