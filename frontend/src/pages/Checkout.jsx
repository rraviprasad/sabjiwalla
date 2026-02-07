import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiTruck, FiPlus, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1); // -1 means new address
    const [saveNewAddress, setSaveNewAddress] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || '',
        paymentMethod: 'cod',
        notes: '',
    });

    // Fetch saved addresses on mount
    useEffect(() => {
        const fetchAddresses = async () => {
            if (isAuthenticated) {
                try {
                    const { data } = await axios.get('/api/auth/profile');
                    // Ensure savedAddresses exists
                    const addresses = data.savedAddresses || [];
                    setSavedAddresses(addresses);

                    // If user has saved addresses, select the default or first one
                    const defaultIndex = addresses.findIndex(a => a.isDefault);
                    if (defaultIndex !== -1) {
                        selectAddress(addresses[defaultIndex], defaultIndex);
                    } else if (addresses.length > 0) {
                        selectAddress(addresses[0], 0);
                    }
                } catch (error) {
                    console.error("Error fetching addresses", error);
                }
            }
        };
        fetchAddresses();
    }, [isAuthenticated]);

    const selectAddress = (address, index) => {
        setSelectedAddressIndex(index);
        setFormData(prev => ({
            ...prev,
            name: address.name || prev.name,
            phone: address.phone || prev.phone,
            street: address.street,
            city: address.city,
            state: address.state,
            pincode: address.pincode
        }));
    };

    const deliveryCharge = getCartTotal() >= 500 ? 0 : 40;
    const total = getCartTotal() + deliveryCharge;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // If user manually changes fields, unset selected address (treat as new/custom)
        if (['street', 'city', 'state', 'pincode'].includes(e.target.name)) {
            setSelectedAddressIndex(-1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setLoading(true);

        try {
            // Save address if requested and it's a new address
            if (selectedAddressIndex === -1 && saveNewAddress) {
                try {
                    await axios.post('/api/auth/save-address', {
                        name: formData.name,
                        phone: formData.phone,
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        isDefault: savedAddresses.length === 0 // Make default if it's the first one
                    });
                    toast.success('Address saved for future use');
                } catch (err) {
                    console.error("Failed to save address", err);
                    // Continue with order even if save fails
                }
            }

            const orderData = {
                items: cartItems.map((item) => ({
                    product: item._id,
                    name: item.name,
                    image: item.image,
                    price: item.discount > 0
                        ? item.price - (item.price * item.discount / 100)
                        : item.price,
                    quantity: item.quantity,
                })),
                shippingAddress: {
                    name: formData.name,
                    phone: formData.phone,
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                },
                paymentMethod: formData.paymentMethod,
                itemsTotal: getCartTotal(),
                deliveryCharge,
                totalAmount: total,
                notes: formData.notes,
            };

            await axios.post('/api/orders', orderData);
            clearCart();
            toast.success('Order placed successfully!');
            navigate('/order-success');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 style={{ fontSize: '2rem', marginBottom: '32px' }}>Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="checkout-layout">
                        <div>
                            {/* Saved Addresses Section */}
                            {savedAddresses.length > 0 && (
                                <div className="checkout-form" style={{ marginBottom: '24px' }}>
                                    <h2><FiMapPin /> Select Delivery Address</h2>
                                    <div className="saved-addresses-grid">
                                        {savedAddresses.map((addr, index) => (
                                            <div
                                                key={index}
                                                className={`saved-address-card ${selectedAddressIndex === index ? 'selected' : ''}`}
                                                onClick={() => selectAddress(addr, index)}
                                            >
                                                {selectedAddressIndex === index && <div className="selected-check"><FiCheck /></div>}
                                                <p style={{ fontWeight: 600, marginBottom: '4px' }}>{addr.name || user?.name}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{addr.phone || 'No phone'}</p>
                                                <p>{addr.street}</p>
                                                <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                            </div>
                                        ))}
                                        <div
                                            className={`saved-address-card new-address ${selectedAddressIndex === -1 ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedAddressIndex(-1);
                                                setFormData({
                                                    ...formData,
                                                    street: '',
                                                    city: '',
                                                    state: '',
                                                    pincode: ''
                                                });
                                            }}
                                        >
                                            <div className="new-addr-icon"><FiPlus /></div>
                                            <p>Add New Address</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Shipping Address Inputs */}
                            <div className="checkout-form" style={{ marginBottom: '24px' }}>
                                <h2>
                                    <span>1</span>
                                    <FiMapPin /> Delivery Details
                                </h2>

                                <div className="form-row">
                                    <div className="input-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="input"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="input"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Street Address</label>
                                    <input
                                        type="text"
                                        name="street"
                                        className="input"
                                        value={formData.street}
                                        onChange={handleChange}
                                        required
                                        placeholder="House no, Building, Street"
                                    // Disable if selected from saved, or allow edit? Allowing edit unselects it.
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="input-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            className="input"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            placeholder="City"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            className="input"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                            placeholder="State"
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        className="input"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        required
                                        placeholder="400001"
                                        style={{ maxWidth: '200px' }}
                                    />
                                </div>

                                {/* Save Address Checkbox - Only show if entering a new address */}
                                {selectedAddressIndex === -1 && (
                                    <div className="save-address-option" style={{ marginTop: '16px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={saveNewAddress}
                                                onChange={(e) => setSaveNewAddress(e.target.checked)}
                                                style={{ width: '18px', height: '18px' }}
                                            />
                                            <span>Save this address for future orders</span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Payment Method */}
                            <div className="checkout-form" style={{ marginBottom: '24px' }}>
                                <h2>
                                    <span>2</span>
                                    <FiCreditCard /> Payment Method
                                </h2>

                                <div className="payment-options">
                                    <div
                                        className={`payment-option ${formData.paymentMethod === 'cod' ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                                    >
                                        <FiTruck />
                                        <span>Cash on Delivery</span>
                                    </div>
                                    <div
                                        className={`payment-option ${formData.paymentMethod === 'online' ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, paymentMethod: 'online' })}
                                    >
                                        <FiCreditCard />
                                        <span>Online Payment</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="checkout-form">
                                <h2>
                                    <span>3</span>
                                    Delivery Notes (Optional)
                                </h2>
                                <textarea
                                    name="notes"
                                    className="input"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Any special instructions for delivery..."
                                    rows={3}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="cart-summary">
                            <h3>Order Summary</h3>

                            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
                                {cartItems.map((item) => (
                                    <div key={item._id} style={{
                                        display: 'flex',
                                        gap: '12px',
                                        padding: '12px 0',
                                        borderBottom: '1px solid #f1f5f9'
                                    }}>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '8px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>{item.name}</p>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <span style={{ fontWeight: 600 }}>
                                            ₹{((item.discount > 0 ? item.price - (item.price * item.discount / 100) : item.price) * item.quantity).toFixed(0)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{getCartTotal().toFixed(0)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Delivery Charge</span>
                                <span style={{ color: deliveryCharge === 0 ? 'var(--success)' : 'inherit' }}>
                                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                                </span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{total.toFixed(0)}</span>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary checkout-btn"
                                disabled={loading}
                            >
                                {loading ? 'Placing Order...' : `Place Order - ₹${total.toFixed(0)}`}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
                .saved-addresses-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 16px;
                    margin-top: 16px;
                }
                .saved-address-card {
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 12px;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s;
                    font-size: 0.9rem;
                    background: #f8fafc;
                }
                .saved-address-card:hover {
                    border-color: var(--primary);
                }
                .saved-address-card.selected {
                    border-color: var(--primary);
                    background: #f0fdf4;
                    box-shadow: 0 0 0 1px var(--primary);
                }
                .selected-check {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: var(--primary);
                    color: white;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                }
                .saved-address-card.new-address {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    border-style: dashed;
                    background: white;
                }
                .new-addr-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-secondary);
                }
            `}</style>
        </div>
    );
};

export default Checkout;
