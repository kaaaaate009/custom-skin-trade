const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const watchTradeSchema = new Schema({
    user_id : {type: Schema.Types.ObjectId, ref: 'User'},
    trade_item_id : {type: Schema.Types.ObjectId, ref: 'trade_items'},
});

module.exports = mongoose.model('WatchList',watchTradeSchema);