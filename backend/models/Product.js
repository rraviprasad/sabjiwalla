import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    nameHindi: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: 0,
    },
    unit: {
        type: String,
        enum: ['kg', '500g', '250g', 'piece', 'bunch', 'dozen'],
        default: 'kg',
    },
    category: {
        type: String,
        enum: ['vegetables', 'fruits', 'leafy', 'exotic', 'herbs'],
        required: [true, 'Category is required'],
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300x300?text=Vegetable',
    },
    stock: {
        type: Number,
        default: 100,
        min: 0,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function () {
    return this.price - (this.price * this.discount / 100);
});

productSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
