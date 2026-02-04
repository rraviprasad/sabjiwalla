import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiHome, FiShoppingBag, FiPackage, FiSettings } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();
    const { getCartCount } = useCart();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const navLinks = [
        { path: '/', label: 'Home', icon: <FiHome /> },
        { path: '/shop', label: 'Shop', icon: <FiShoppingBag /> },
        { path: '/orders', label: 'My Orders', icon: <FiPackage />, auth: true },
        { path: '/admin', label: 'Admin', icon: <FiSettings />, admin: true },
    ];

    const filteredLinks = navLinks.filter(link => {
        if (link.admin) return isAdmin;
        if (link.auth) return user;
        return true;
    });

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <nav className="navbar">
                <div className="container">
                    {/* Hamburger Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                    >
                        <FiMenu />
                    </button>

                    <Link to="/" className="navbar-brand">
                        <span>🥬</span>
                        Sabjiwala
                    </Link>

                    <div className="navbar-nav">
                        {filteredLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={location.pathname === link.path ? 'active' : ''}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="navbar-actions">
                        <Link to="/cart" className="btn btn-icon cart-btn">
                            <FiShoppingCart />
                            {getCartCount() > 0 && (
                                <span className="cart-badge">{getCartCount()}</span>
                            )}
                        </Link>

                        {user ? (
                            <div className="user-info">
                                <span className="user-name">
                                    Hi, {user.name.split(' ')[0]}
                                </span>
                                <button onClick={handleLogout} className="btn btn-icon" title="Logout">
                                    <FiLogOut />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-sm login-btn">
                                <FiUser />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Menu */}
            <div className={`mobile-sidebar-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu} />
            <aside className={`mobile-sidebar ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-sidebar-header">
                    <Link to="/" className="navbar-brand" onClick={closeMenu}>
                        <span>🥬</span>
                        Sabjiwala
                    </Link>
                    <button className="btn btn-icon" onClick={closeMenu}>
                        <FiX />
                    </button>
                </div>

                {user && (
                    <div className="mobile-user-info">
                        <div className="user-avatar">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="user-name">{user.name}</p>
                            <p className="user-email">{user.email}</p>
                        </div>
                    </div>
                )}

                <nav className="mobile-nav-links">
                    {filteredLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={location.pathname === link.path ? 'active' : ''}
                            onClick={closeMenu}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                    <Link to="/cart" onClick={closeMenu}>
                        <FiShoppingCart />
                        Cart
                        {getCartCount() > 0 && (
                            <span className="mobile-cart-badge">{getCartCount()}</span>
                        )}
                    </Link>
                </nav>

                <div className="mobile-sidebar-footer">
                    {user ? (
                        <button onClick={handleLogout} className="btn btn-secondary btn-block">
                            <FiLogOut />
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-block" onClick={closeMenu}>
                            <FiUser />
                            Login / Register
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Navbar;
