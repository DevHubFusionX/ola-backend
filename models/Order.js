const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, default: 'Nigeria' }
    },
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'items.itemModel'
        },
        itemModel: {
            type: String,
            required: true,
            enum: ['Product', 'Combo']
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        color: String,
        size: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Bank Transfer', 'On Delivery'],
        default: 'Bank Transfer'
    },
    deliveryMethod: {
        type: String,
        enum: ['Standard', 'Express', 'Pickup'],
        default: 'Standard'
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    orderNumber: {
        type: String,
        unique: true
    },
    receiptImage: {
        type: String
    },
    receiptCloudinaryId: {
        type: String
    }
}, {
    timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function (next) {
    if (!this.orderNumber) {
        this.orderNumber = 'OLA-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
