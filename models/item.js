const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skinSchema = new Schema({
    item_name: { type: String, required: [true, 'Item name is required'] },
    item_category: { type: String, required: [true, 'Item category is required'] },
    item_details: {
        type: String, required: [true, 'Item details are required'],
        minLength: [10, 'Item details should have at-least 10 characters']
    },
    image: { type: String, required: [true, 'author is required'] },
    disc_price: { type: String, required: [true, 'Discounted price is required'] },
    status : {type: String},
    fav: { type: Boolean },
    org_price: { type: String, required: [true, 'Original price is required'] },
    created_by: { type: Schema.Types.ObjectId, ref: 'User' }
},
    { timestamps: true }
);

module.exports = mongoose.model('trade_items', skinSchema);
