import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiBox, FiList, FiX, FiEye, FiMapPin, FiPhone, FiUser, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const statuses = [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'preparing', label: 'Preparing' },
        { value: 'out_for_delivery', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        fetchOrders();
    }, [isAdmin, navigate]);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/orders/all');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
            toast.success('Order status updated!');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
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

    const getCancelReasonLabel = (reason) => {
        const labels = {
            changed_mind: 'Changed mind',
            found_cheaper: 'Found cheaper',
            wrong_items: 'Wrong items',
            delivery_too_long: 'Slow delivery',
            other: 'Other'
        };
        return labels[reason] || reason;
    };

    // Filter orders based on search and status
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // Status filter
            if (statusFilter !== 'all' && order.status !== statusFilter) {
                return false;
            }

            // Search filter - search by order ID, customer name, or phone
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const orderId = order._id.toLowerCase();
                const customerName = order.shippingAddress?.name?.toLowerCase() || '';
                const customerPhone = order.shippingAddress?.phone || '';

                if (!orderId.includes(query) &&
                    !customerName.includes(query) &&
                    !customerPhone.includes(query)) {
                    return false;
                }
            }

            return true;
        });
    }, [orders, searchQuery, statusFilter]);

    if (loading) return <Loader />;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-nav">
                    <Link to="/admin">
                        <FiPackage /> Dashboard
                    </Link>
                    <Link to="/admin/products">
                        <FiBox /> Products
                    </Link>
                    <Link to="/admin/orders" className="active">
                        <FiList /> Orders
                    </Link>
                </div>
            </aside>

            <div className="admin-content">
                <div className="admin-header">
                    <h1>Orders</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {filteredOrders.length} of {orders.length} orders
                    </p>
                </div>

                {/* Search and Filters */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '20px',
                    flexWrap: 'wrap'
                }}>
                    {/* Search Box */}
                    <div style={{
                        position: 'relative',
                        flex: '1',
                        minWidth: '200px',
                        maxWidth: '350px'
                    }}>
                        <FiSearch style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8'
                        }} />
                        <input
                            type="text"
                            placeholder="Search by ID, name, phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input"
                            style={{
                                paddingLeft: '38px',
                                width: '100%'
                            }}
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input"
                        style={{ minWidth: '140px' }}
                    >
                        <option value="all">All Status</option>
                        {statuses.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                <div className="admin-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>
                                        <span style={{ fontWeight: 600 }}>
                                            #{order._id.slice(-8).toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <div>
                                            <p style={{ fontWeight: 500 }}>{order.shippingAddress?.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                {order.shippingAddress?.phone}
                                            </p>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                            {order.items.slice(0, 2).map((item, idx) => (
                                                <img
                                                    key={idx}
                                                    src={item.image}
                                                    alt={item.name}
                                                    title={`${item.name} x${item.quantity}`}
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        objectFit: 'cover',
                                                        borderRadius: '6px',
                                                    }}
                                                />
                                            ))}
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    background: '#f0fdf4',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    color: '#22c55e'
                                                }}
                                                title="View all items"
                                            >
                                                <FiEye size={16} />
                                            </button>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                                        ₹{order.totalAmount}
                                    </td>
                                    <td style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                        {order.paymentMethod}
                                    </td>
                                    <td style={{ fontSize: '0.875rem' }}>
                                        {formatDate(order.createdAt)}
                                    </td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            className="input"
                                            style={{
                                                padding: '8px 12px',
                                                fontSize: '0.875rem',
                                                width: 'auto',
                                                minWidth: '140px',
                                            }}
                                        >
                                            {statuses.map((status) => (
                                                <option key={status.value} value={status.value}>
                                                    {status.label}
                                                </option>
                                            ))}
                                        </select>
                                        {/* Show cancellation reason for cancelled orders */}
                                        {order.status === 'cancelled' && order.cancellationReason && (
                                            <div
                                                style={{
                                                    marginTop: '6px',
                                                    fontSize: '0.7rem',
                                                    color: '#ef4444',
                                                    background: '#fee2e2',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    maxWidth: '140px'
                                                }}
                                                title={order.customCancelReason || getCancelReasonLabel(order.cancellationReason)}
                                            >
                                                ❌ {getCancelReasonLabel(order.cancellationReason)}
                                                {order.customCancelReason && (
                                                    <div style={{ marginTop: '2px', fontStyle: 'italic' }}>
                                                        "{order.customCancelReason.slice(0, 30)}{order.customCancelReason.length > 30 ? '...' : ''}"
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {orders.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>No orders yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
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
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            maxWidth: '500px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{
                            padding: '20px',
                            borderBottom: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'sticky',
                            top: 0,
                            background: 'white',
                            zIndex: 1
                        }}>
                            <div>
                                <h3 style={{ marginBottom: '4px' }}>Order #{selectedOrder._id.slice(-8).toUpperCase()}</h3>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    {formatDate(selectedOrder.createdAt)}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px'
                                }}
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Customer Info */}
                        <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                                    <FiUser size={14} color="#64748b" />
                                    {selectedOrder.shippingAddress?.name}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                                    <FiPhone size={14} color="#64748b" />
                                    {selectedOrder.shippingAddress?.phone}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.875rem', marginTop: '8px', color: 'var(--text-secondary)' }}>
                                <FiMapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                                {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                            </div>
                        </div>

                        {/* Products List */}
                        <div style={{ padding: '16px 20px' }}>
                            <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Order Items ({selectedOrder.items.length})
                            </h4>

                            {selectedOrder.items.map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        padding: '12px',
                                        background: '#f8fafc',
                                        borderRadius: '8px',
                                        marginBottom: '8px',
                                        alignItems: 'center'
                                    }}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 500, marginBottom: '2px' }}>{item.name}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            ₹{item.price} × {item.quantity}
                                        </p>
                                    </div>
                                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                                        ₹{(item.price * item.quantity).toFixed(0)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                <span>Items Total</span>
                                <span>₹{selectedOrder.itemsTotal}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                <span>Delivery</span>
                                <span>₹{selectedOrder.deliveryCharge}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.1rem', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                                <span>Total</span>
                                <span style={{ color: 'var(--primary)' }}>₹{selectedOrder.totalAmount}</span>
                            </div>
                            <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Payment: <strong style={{ textTransform: 'uppercase' }}>{selectedOrder.paymentMethod}</strong>
                            </div>
                            {selectedOrder.notes && (
                                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                    📝 Note: {selectedOrder.notes}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
