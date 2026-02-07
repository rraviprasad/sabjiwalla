import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiShoppingCart, FiUsers, FiDollarSign, FiBox, FiList } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    axios.get('/api/orders/admin/stats'),
                    axios.get('/api/orders/all'),
                ]);
                setStats(statsRes.data);
                setRecentOrders(ordersRes.data.slice(0, 5));
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isAdmin, navigate]);

    if (loading) return <Loader />;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-nav">
                    <Link to="/admin" className="active">
                        <FiPackage /> Dashboard
                    </Link>
                    <Link to="/admin/products">
                        <FiBox /> Products
                    </Link>
                    <Link to="/admin/orders">
                        <FiList /> Orders
                    </Link>
                </div>
            </aside>

            <div className="admin-content">
                <div className="admin-header">
                    <h1>Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Welcome back, Admin! Here's what's happening today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-icon green">
                            <FiDollarSign />
                        </div>
                        <h3>₹{stats?.totalRevenue?.toLocaleString() || 0}</h3>
                        <p>Total Revenue</p>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-icon orange">
                            <FiShoppingCart />
                        </div>
                        <h3>{stats?.totalOrders || 0}</h3>
                        <p>Total Orders</p>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-icon blue">
                            <FiPackage />
                        </div>
                        <h3>{stats?.pendingOrders || 0}</h3>
                        <p>Pending Orders</p>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-icon purple">
                            <FiUsers />
                        </div>
                        <h3>{stats?.deliveredOrders || 0}</h3>
                        <p>Delivered</p>
                    </div>
                </div>

                {/* Quick Actions - Moved UP for easier access */}
                <div className="admin-quick-actions" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px',
                    marginBottom: '32px'
                }}>
                    <Link to="/admin/products" className="card" style={{
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        textDecoration: 'none'
                    }}>
                        <div className="stat-card-icon green">
                            <FiBox />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '4px' }}>Manage Products</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                Add, edit, or remove products
                            </p>
                        </div>
                    </Link>

                    <Link to="/admin/orders" className="card" style={{
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        textDecoration: 'none'
                    }}>
                        <div className="stat-card-icon orange">
                            <FiList />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '4px' }}>Manage Orders</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                View and update order status
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Recent Orders - Moved DOWN */}
                <div className="admin-table">
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>Recent Orders</h2>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>#{order._id.slice(-8).toUpperCase()}</td>
                                    <td>{order.shippingAddress?.name || 'N/A'}</td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td style={{ fontWeight: 600 }}>₹{order.totalAmount}</td>
                                    <td>
                                        <span className={`status-badge ${order.status}`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
