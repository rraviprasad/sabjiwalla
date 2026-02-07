import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

    const deliveryCharge = getCartTotal() >= 500 ? 0 : 40;
    const total = getCartTotal() + deliveryCharge;

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/shop" className="btn btn-primary">
                            <FiShoppingBag /> Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1 style={{ fontSize: '1.75rem', marginBottom: '16px' }}>
                    Shopping Cart ({getCartCount()} items)
                </h1>

                <div className="cart-layout">
                    <div className="cart-items">
                        {cartItems.map((item) => {
                            const discountedPrice = item.discount > 0
                                ? item.price - (item.price * item.discount / 100)
                                : item.price;

                            return (
                                <div key={item._id} className="cart-item">
                                    <div className="cart-item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="cart-item-info">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                                            <h3 className="cart-item-name">{item.name}</h3>
                                            <div style={{
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                                color: 'var(--primary)',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                ₹{(discountedPrice * item.quantity).toFixed(0)}
                                            </div>
                                        </div>
                                        <p className="cart-item-price">
                                            ₹{discountedPrice.toFixed(0)} / {item.unit}
                                        </p>
                                        <div className="cart-item-actions">
                                            <div className="quantity-controls">
                                                <button
                                                    className="quantity-btn"
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                >
                                                    <FiMinus />
                                                </button>
                                                <span className="quantity-value">{item.quantity}</span>
                                                <button
                                                    className="quantity-btn"
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                >
                                                    <FiPlus />
                                                </button>
                                            </div>
                                            <button
                                                className="remove-btn"
                                                onClick={() => removeFromCart(item._id)}
                                            >
                                                <FiTrash2 /> <span>Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal ({getCartCount()} items)</span>
                            <span>₹{getCartTotal().toFixed(0)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Charge</span>
                            <span style={{ color: deliveryCharge === 0 ? 'var(--success)' : 'inherit' }}>
                                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                            </span>
                        </div>
                        {deliveryCharge > 0 && (
                            <p style={{
                                fontSize: '0.875rem',
                                color: 'var(--text-muted)',
                                marginBottom: '12px'
                            }}>
                                Add ₹{(500 - getCartTotal()).toFixed(0)} more for free delivery
                            </p>
                        )}
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{total.toFixed(0)}</span>
                        </div>
                        <Link to="/checkout" className="btn btn-primary checkout-btn">
                            Proceed to Checkout <FiArrowRight />
                        </Link>
                        <Link
                            to="/shop"
                            style={{
                                display: 'block',
                                textAlign: 'center',
                                marginTop: '16px',
                                color: 'var(--primary)',
                                fontWeight: 500
                            }}
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
