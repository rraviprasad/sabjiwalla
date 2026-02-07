import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const category = searchParams.get('category') || 'all';
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { value: 'all', label: 'All Products' },
        { value: 'vegetables', label: 'Vegetables' },
        { value: 'fruits', label: 'Fruits' },
        { value: 'leafy', label: 'Leafy Greens' },
        { value: 'exotic', label: 'Exotic' },
        { value: 'herbs', label: 'Herbs' },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = '/api/products';
                const params = new URLSearchParams();

                if (category !== 'all') {
                    params.append('category', category);
                }
                if (searchQuery) {
                    params.append('search', searchQuery);
                }

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                const { data } = await axios.get(url);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchProducts, 300);
        return () => clearTimeout(debounce);
    }, [category, searchQuery]);

    const handleCategoryChange = (value) => {
        if (value === 'all') {
            setSearchParams({});
        } else {
            setSearchParams({ category: value });
        }
    };

    const currentCategory = categories.find(c => c.value === category);

    return (
        <div className="shop-page">
            <div className="container">
                <div className="shop-header" style={{ marginBottom: '16px' }}>
                    <h1>Fresh Produce Shop</h1>
                    <p>Browse our selection of farm-fresh vegetables and fruits</p>
                </div>

                {/* Mobile Filters: Category (Left) & Search (Right) Side-by-Side */}
                <div className="mobile-only-filters" style={{
                    display: 'none',
                    gap: '8px',
                    marginBottom: '16px',
                    alignItems: 'center'
                }}>
                    <div style={{ flex: '0 0 130px' }}>
                        <div className="category-dropdown" style={{ margin: 0 }}>
                            <select
                                value={category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                style={{
                                    padding: '10px 30px 10px 12px',
                                    fontSize: '0.9rem',
                                    borderRadius: '12px',
                                    height: '44px'
                                }}
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label.split(' ')[0]} {/* Shorter labels for mobile */}
                                    </option>
                                ))}
                            </select>
                            <FiChevronDown className="dropdown-icon" style={{ right: '10px' }} />
                        </div>
                    </div>

                    <div style={{ position: 'relative', flex: 1 }}>
                        <FiSearch style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8',
                            fontSize: '16px'
                        }} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input"
                            style={{
                                padding: '10px 10px 10px 36px',
                                width: '100%',
                                fontSize: '0.9rem',
                                borderRadius: '12px',
                                height: '44px',
                                border: '1px solid #e2e8f0'
                            }}
                        />
                    </div>
                </div>

                {/* Desktop Search Bar (Hidden on mobile) */}
                <div className="desktop-search-container" style={{
                    position: 'relative',
                    maxWidth: '400px',
                    margin: '0 auto 24px auto'
                }}>
                    <FiSearch style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                        fontSize: '18px'
                    }} />
                    <input
                        type="text"
                        placeholder="Search vegetables, fruits..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input"
                        style={{
                            paddingLeft: '44px',
                            width: '100%',
                            fontSize: '1rem',
                            padding: '14px 14px 14px 44px',
                            borderRadius: '50px',
                            border: '2px solid #e2e8f0'
                        }}
                    />
                </div>

                {/* Desktop: Button Filters */}
                <div className="shop-filters desktop-filters">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            className={`filter-btn ${category === cat.value ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat.value)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <style>{`
                    @media (max-width: 768px) {
                        .mobile-only-filters {
                            display: flex !important;
                        }
                        .desktop-search-container, .desktop-filters, .mobile-category-select {
                            display: none !important;
                        }
                        .shop-header h1 {
                            font-size: 1.5rem !important;
                            margin-bottom: 4px !important;
                        }
                        .shop-header p {
                            font-size: 0.85rem !important;
                            margin-bottom: 0 !important;
                        }
                        .shop-page {
                            padding-top: 80px !important;
                        }
                    }
                `}</style>

                {loading ? (
                    <Loader />
                ) : products.length > 0 ? (
                    <>
                        <p className="products-count">
                            Showing {products.length} products
                        </p>
                        <div className="product-grid">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <p style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</p>
                        <h2 style={{ marginBottom: '8px' }}>No products found</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
