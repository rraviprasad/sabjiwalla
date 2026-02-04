import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiBox, FiList } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
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
                        {orders.length} total orders
                    </p>
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
                            {orders.map((order) => (
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
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {order.items.slice(0, 3).map((item, idx) => (
                                                <img
                                                    key={idx}
                                                    src={item.image}
                                                    alt={item.name}
                                                    title={`${item.name} x${item.quantity}`}
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        objectFit: 'cover',
                                                        borderRadius: '6px',
                                                    }}
                                                />
                                            ))}
                                            {order.items.length > 3 && (
                                                <span style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    background: 'var(--bg-primary)',
                                                    borderRadius: '6px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                }}>
                                                    +{order.items.length - 3}
                                                </span>
                                            )}
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
        </div>
    );
};

export default AdminOrders;
