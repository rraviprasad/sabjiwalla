import { useState, useEffect, useMemo } from 'react';
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
    const [showCancelModal, setShowCancelModal] = useState(null); // order ID to cancel
    const [cancelReason, setCancelReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const orderStatuses = [
        { value: 'all', label: 'All Orders' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'preparing', label: 'Preparing' },
        { value: 'out_for_delivery', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const cancelReasons = [
        { value: 'changed_mind', label: 'Changed my mind' },
        { value: 'found_cheaper', label: 'Found cheaper elsewhere' },
        { value: 'wrong_items', label: 'Ordered wrong items' },
        { value: 'delivery_too_long', label: 'Delivery taking too long' },
        { value: 'other', label: 'Other reason' },
    ];

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

    const openCancelModal = (orderId) => {
        setShowCancelModal(orderId);
        setCancelReason('');
        setCustomReason('');
    };

    const closeCancelModal = () => {
        setShowCancelModal(null);
        setCancelReason('');
        setCustomReason('');
    };

    const handleCancelOrder = async () => {
        if (!cancelReason) {
            toast.error('Please select a reason for cancellation');
            return;
        }

        if (cancelReason === 'other' && !customReason.trim()) {
            toast.error('Please type your reason for cancellation');
            return;
        }

        const orderId = showCancelModal;
        setCancelling(orderId);
        try {
            await axios.put(`/api/orders/${orderId}/cancel`, {
                reason: cancelReason,
                customReason: cancelReason === 'other' ? customReason : undefined
            });
            toast.success('Order cancelled successfully');
            // Update the order in state
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: 'cancelled' } : order
            ));
            closeCancelModal();
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

    // Filter orders by status
    const filteredOrders = useMemo(() => {
        if (statusFilter === 'all') return orders;
        return orders.filter(order => order.status === statusFilter);
    }, [orders, statusFilter]);

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                    <h1 style={{ margin: 0 }}>My Orders</h1>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input"
                        style={{ minWidth: '140px', padding: '10px 12px' }}
                    >
                        {orderStatuses.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {filteredOrders.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                        No {statusFilter !== 'all' ? statusFilter.replace('_', ' ') : ''} orders found
                    </div>
                )}

                {filteredOrders.map((order) => (
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
                                        onClick={() => openCancelModal(order._id)}
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
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                            <span className="order-total">Total: ₹{order.totalAmount.toFixed(0)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cancel Order Modal */}
            {showCancelModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px',
                    }}
                    onClick={closeCancelModal}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            maxWidth: '400px',
                            width: '100%',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>Cancel Order</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
                            Please tell us why you're cancelling this order
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                            {cancelReasons.map((reason) => (
                                <label
                                    key={reason.value}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        border: `2px solid ${cancelReason === reason.value ? '#22c55e' : '#e2e8f0'}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        background: cancelReason === reason.value ? '#f0fdf4' : 'transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="cancelReason"
                                        value={reason.value}
                                        checked={cancelReason === reason.value}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        style={{ width: '18px', height: '18px', accentColor: '#22c55e' }}
                                    />
                                    {reason.label}
                                </label>
                            ))}

                            {/* Custom reason text input - shown when "other" is selected */}
                            {cancelReason === 'other' && (
                                <textarea
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    placeholder="Please tell us your reason..."
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        resize: 'none',
                                        marginTop: '8px'
                                    }}
                                />
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={closeCancelModal}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={!cancelReason || cancelling}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    background: cancelReason ? '#ef4444' : '#fca5a5',
                                    color: 'white',
                                    cursor: cancelReason ? 'pointer' : 'not-allowed',
                                    fontWeight: 500
                                }}
                            >
                                {cancelling ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
