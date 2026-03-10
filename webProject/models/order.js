const mongoose = require("mongoose");
const orderSchema = mongoose.Schema;

let order = new orderSchema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cart: {
        type: Object,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    paymentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Confirmed'
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Order" , order);