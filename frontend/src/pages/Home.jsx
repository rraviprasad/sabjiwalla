import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiShield, FiClock, FiHeart, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const { data } = await axios.get('/api/products?featured=true');
                setFeaturedProducts(data.slice(0, 8));
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedProducts();
    }, []);

    const categories = [
        { name: 'Vegetables', icon: '🥕', count: 50, path: '/shop?category=vegetables' },
        { name: 'Fruits', icon: '🍎', count: 35, path: '/shop?category=fruits' },
        { name: 'Leafy Greens', icon: '🥬', count: 20, path: '/shop?category=leafy' },
        { name: 'Exotic', icon: '🥑', count: 15, path: '/shop?category=exotic' },
        { name: 'Herbs', icon: '🌿', count: 12, path: '/shop?category=herbs' },
    ];

    const features = [
        { icon: <FiHeart />, title: 'Farm Fresh', description: 'Freshly harvested from local fields every morning' },
        { icon: <FiTruck />, title: 'Instant Delivery', description: 'Get fresh veggies at your doorstep within 60 minutes' },
        { icon: <FiShield />, title: 'Triple Quality Check', description: 'Hand-picked, sanitized, and packed with care' },
        { icon: <FiClock />, title: 'On-spot Returns', description: 'Check freshness at delivery. Don\'t like it? Return it immediately.' },
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span>🌱</span> Fresh & Organic
                        </div>
                        <h1 className="hero-title">
                            Fresh <span>Vegetables</span> & Fruits at Your Doorstep
                        </h1>
                        <p className="hero-description">
                            Experience the taste of freshness with Sabjiwala. We deliver farm-fresh
                            vegetables and fruits directly to your home. Healthy eating starts here!
                        </p>
                        <div className="hero-buttons">
                            <Link to="/shop" className="btn btn-primary btn-lg">
                                Shop Now <FiArrowRight />
                            </Link>
                            <Link to="/shop?category=fruits" className="btn btn-secondary btn-lg">
                                Explore Fruits
                            </Link>
                        </div>
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <div className="hero-stat-value">50+</div>
                                <div className="hero-stat-label">Products</div>
                            </div>
                            <div className="hero-stat">
                                <div className="hero-stat-value">10+</div>
                                <div className="hero-stat-label">Customers</div>
                            </div>
                            <div className="hero-stat">
                                <div className="hero-stat-value">25</div>
                                <div className="hero-stat-label">Farmers</div>
                            </div>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop"
                            alt="Fresh vegetables and fruits"
                        />
                        <div className="floating-card">
                            <div className="floating-card-icon">🚚</div>
                            <div className="floating-card-text">
                                <h4>Free Delivery</h4>
                                <p>On orders above ₹500</p>
                            </div>
                        </div>
                        <div className="floating-card">
                            <div className="floating-card-icon">✨</div>
                            <div className="floating-card-text">
                                <h4>Fresh Daily</h4>
                                <p>Farm to doorstep</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section" style={{ background: 'white' }}>
                <div className="container">
                    <h2 className="section-title">Shop by Category</h2>
                    <p className="section-subtitle">Browse our wide selection of fresh produce</p>
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <Link to={category.path} key={category.name} className="category-card">
                                <div className="category-icon">{category.icon}</div>
                                <h3 className="category-name">{category.name}</h3>
                                <p className="category-count">{category.count}+ items</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Featured Products</h2>
                    <p className="section-subtitle">Our handpicked selection of the freshest produce</p>
                    {loading ? (
                        <Loader />
                    ) : featuredProducts.length > 0 ? (
                        <div className="product-grid">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                            <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🥬</p>
                            <p>No featured products yet. Check back soon!</p>
                        </div>
                    )}
                    <div style={{ textAlign: 'center', marginTop: '48px' }}>
                        <Link to="/shop" className="btn btn-primary btn-lg">
                            View All Products <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section" style={{ background: 'white' }}>
                <div className="container">
                    <h2 className="section-title">Why Choose Sabjiwala?</h2>
                    <p className="section-subtitle">We make healthy eating easy and affordable</p>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta-section" style={{
                background: 'var(--primary-gradient)',
                color: 'white',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                        Ready to Eat Fresh? 🥗
                    </h2>
                    <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                        Experience the joy of cooking with farm-fresh vegetables delivered right to your doorstep.
                    </p>
                    <Link to="/shop" className="btn btn-lg" style={{
                        background: 'white',
                        color: 'var(--primary-dark)',
                        fontWeight: 700
                    }}>
                        Start Shopping <FiArrowRight />
                    </Link>
                </div>
            </section>
        </>
    );
};

export default Home;
