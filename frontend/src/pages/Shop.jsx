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
                <div className="shop-header">
                    <h1>Fresh Produce Shop</h1>
                    <p>Browse our selection of farm-fresh vegetables and fruits</p>
                </div>

                {/* Mobile: Dropdown Category Select */}
                <div className="mobile-category-select">
                    <label>Category</label>
                    <div className="category-dropdown">
                        <select
                            value={category}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                        >
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                        <FiChevronDown className="dropdown-icon" />
                    </div>
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

                {/* Search Bar */}
                <div className="search-bar-wrapper">
                    <div className="search-bar">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

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
