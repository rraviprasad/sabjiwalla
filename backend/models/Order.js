import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: String,
    image: String,
    price: Number,
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'online'],
        default: 'cod',
    },
    itemsTotal: {
        type: Number,
        required: true,
    },
    deliveryCharge: {
        type: Number,
        default: 40,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending',
    },
    deliveryDate: {
        type: Date,
    },
    notes: String,
    cancellationReason: {
        type: String,
        enum: ['changed_mind', 'found_cheaper', 'wrong_items', 'delivery_too_long', 'other'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
