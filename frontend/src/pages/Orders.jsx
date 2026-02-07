import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiX } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/api/orders');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [isAuthenticated, navigate]);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        setCancelling(orderId);
        try {
            await axios.put(`/api/orders/${orderId}/cancel`);
            toast.success('Order cancelled successfully');
            // Update the order in state
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: 'cancelled' } : order
            ));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        } finally {
            setCancelling(null);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#f59e0b',
            confirmed: '#3b82f6',
            preparing: '#8b5cf6',
            out_for_delivery: '#ec4899',
            delivered: '#10b981',
            cancelled: '#ef4444',
        };
        return colors[status] || '#64748b';
    };

    if (loading) return <Loader />;

    if (orders.length === 0) {
        return (
            <div className="orders-page">
                <div className="container">
                    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <FiPackage style={{ fontSize: '5rem', color: 'var(--text-muted)', marginBottom: '24px' }} />
                        <h2 style={{ marginBottom: '12px' }}>No orders yet</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                            Looks like you haven't placed any orders yet.
                        </p>
                        <Link to="/shop" className="btn btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="container">
                <h1>My Orders</h1>

                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <div>
                                <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                                <span>{formatDate(order.createdAt)}</span>
                            </div>
                            <span
                                className={`status-badge ${order.status}`}
                                style={{ background: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}
                            >
                                {order.status.replace('_', ' ')}
                            </span>
                        </div>

                        <div className="order-items">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="order-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="order-item-info">
                                        <p className="order-item-name">{item.name}</p>
                                        <p className="order-item-qty">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="order-item-price">₹{(item.price * item.quantity).toFixed(0)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="order-footer">
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    Delivery to: {order.shippingAddress.city}
                                </p>
                                {/* Cancel button for pending/confirmed orders */}
                                {['pending', 'confirmed'].includes(order.status) && (
                                    <button
                                        className="btn btn-sm"
                                        onClick={() => handleCancelOrder(order._id)}
                                        disabled={cancelling === order._id}
                                        style={{
                                            marginTop: '8px',
                                            background: '#fee2e2',
                                            color: '#dc2626',
                                            border: 'none',
                                            padding: '6px 12px',
                                            fontSize: '0.75rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        <FiX size={14} />
                                        {cancelling === order._id ? 'Cancelling...' : 'Cancel Order'}
                                    </button>
                                )}
                            </div>
                            <span className="order-total">Total: ₹{order.totalAmount.toFixed(0)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
