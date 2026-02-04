import { Link } from 'react-router-dom';
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

    const cartItem = cartItems.find((item) => item._id === product._id);
    const discountedPrice = product.discount > 0
        ? product.price - (product.price * product.discount / 100)
        : product.price;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    const handleIncrement = (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateQuantity(product._id, cartItem.quantity + 1);
    };

    const handleDecrement = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (cartItem.quantity === 1) {
            removeFromCart(product._id);
        } else {
            updateQuantity(product._id, cartItem.quantity - 1);
        }
    };

    return (
        <Link to={`/product/${product._id}`} className="product-card">
            <div className="product-image">
                <img src={product.image} alt={product.name} />
                {product.discount > 0 && (
                    <span className="product-badge">{product.discount}% OFF</span>
                )}
            </div>

            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                {product.nameHindi && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        {product.nameHindi}
                    </p>
                )}
                <div className="product-price">
                    <span className="current">₹{discountedPrice.toFixed(0)}</span>
                    {product.discount > 0 && (
                        <span className="original">₹{product.price}</span>
                    )}
                    <span className="unit">/ {product.unit}</span>
                </div>

                <div className="product-footer">
                    {cartItem ? (
                        <div className="quantity-controls" onClick={(e) => e.preventDefault()}>
                            <button className="quantity-btn" onClick={handleDecrement}>
                                <FiMinus />
                            </button>
                            <span className="quantity-value">{cartItem.quantity}</span>
                            <button className="quantity-btn" onClick={handleIncrement}>
                                <FiPlus />
                            </button>
                        </div>
                    ) : (
                        <button className="add-to-cart-btn" onClick={handleAddToCart}>
                            <FiShoppingCart />
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
