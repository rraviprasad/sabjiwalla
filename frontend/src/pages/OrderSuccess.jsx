import { Link } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag, FiFileText } from 'react-icons/fi';

const OrderSuccess = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
        }}>
            <div style={{
                textAlign: 'center',
                background: 'white',
                padding: '60px 40px',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-xl)',
                maxWidth: '500px'
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    margin: '0 auto 24px',
                    background: 'var(--primary-gradient)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <FiCheckCircle style={{ fontSize: '3rem', color: 'white' }} />
                </div>

                <h1 style={{ fontSize: '2rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
                    Order Placed Successfully! 🎉
                </h1>

                <p style={{
                    color: 'var(--text-secondary)',
                    marginBottom: '32px',
                    fontSize: '1.1rem',
                    lineHeight: 1.6
                }}>
                    Thank you for your order! We've received it and will start preparing
                    your fresh vegetables right away. You'll receive updates on your order status.
                </p>

                <div style={{
                    background: 'var(--bg-primary)',
                    padding: '24px',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '32px',
                    textAlign: 'left'
                }}>
                    <h3 style={{ marginBottom: '12px', fontSize: '1rem' }}>What's Next?</h3>
                    <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                        <li style={{ marginBottom: '8px' }}>✅ Order confirmation sent to your phone</li>
                        <li style={{ marginBottom: '8px' }}>📦 We're preparing your order</li>
                        <li style={{ marginBottom: '8px' }}>🚚 Delivery to your doorstep</li>
                        <li>💚 Enjoy your fresh vegetables!</li>
                    </ul>
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link to="/orders" className="btn btn-secondary">
                        <FiFileText /> View Orders
                    </Link>
                    <Link to="/shop" className="btn btn-primary">
                        <FiShoppingBag /> Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
