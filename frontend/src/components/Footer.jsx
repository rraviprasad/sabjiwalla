import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>
                            <span>🥬</span> Sabjiwala
                        </h3>
                        <p>
                            Fresh vegetables and fruits delivered straight from the farm to your doorstep.
                            We ensure quality, freshness, and the best prices in town.
                        </p>
                        <div className="footer-social">
                            <a href="#"><FiInstagram /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/shop">Shop</Link></li>
                            <li><Link to="/orders">My Orders</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Categories</h4>
                        <ul>
                            <li><Link to="/shop?category=vegetables">Vegetables</Link></li>
                            <li><Link to="/shop?category=fruits">Fruits</Link></li>
                            <li><Link to="/shop?category=leafy">Leafy Greens</Link></li>
                            <li><Link to="/shop?category=exotic">Exotic</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Contact Us</h4>
                        <ul>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiPhone /> +91 96536 21614
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiMail />  RAVIPRASAD93335@GMAIL.COM
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiMapPin /> Palava, Dombivli (E)   , Thane, Maharashtra, India
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Sabjiwala. Made with 💚 for fresh produce lovers.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
