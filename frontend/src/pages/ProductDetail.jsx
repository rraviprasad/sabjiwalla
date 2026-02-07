import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiPlus, FiMinus, FiArrowLeft, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <Loader />;

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '120px 20px' }}>
                <h2>Product not found</h2>
                <Link to="/shop" className="btn btn-primary" style={{ marginTop: '24px' }}>
                    Back to Shop
                </Link>
            </div>
        );
    }

    const discountedPrice = product.discount > 0
        ? product.price - (product.price * product.discount / 100)
        : product.price;

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    return (
        <div style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: '80px', minHeight: '100vh' }}>
            <div className="container">
                <Link to="/shop" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--text-secondary)',
                    marginBottom: '32px'
                }}>
                    <FiArrowLeft /> Back to Shop
                </Link>

                <div className="product-detail-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '60px',
                    alignItems: 'start'
                }}>
                    {/* Product Image */}
                    <div className="product-detail-image" style={{
                        position: 'relative',
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                        />
                        {product.discount > 0 && (
                            <span className="product-badge" style={{
                                position: 'absolute',
                                top: '20px',
                                left: '20px',
                                fontSize: '1rem',
                                padding: '10px 20px'
                            }}>
                                {product.discount}% OFF
                            </span>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="product-detail-info">
                        <span className="product-category" style={{ fontSize: '0.875rem' }}>
                            {product.category}
                        </span>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '12px 0' }}>
                            {product.name}
                        </h1>
                        {product.nameHindi && (
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '24px' }}>
                                {product.nameHindi}
                            </p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '24px' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                                ₹{discountedPrice.toFixed(0)}
                            </span>
                            {product.discount > 0 && (
                                <span style={{
                                    fontSize: '1.5rem',
                                    color: 'var(--text-muted)',
                                    textDecoration: 'line-through'
                                }}>
                                    ₹{product.price}
                                </span>
                            )}
                            <span style={{ color: 'var(--text-secondary)' }}>/ {product.unit}</span>
                        </div>

                        {product.description && (
                            <p style={{
                                color: 'var(--text-secondary)',
                                lineHeight: 1.8,
                                marginBottom: '32px',
                                fontSize: '1.1rem'
                            }}>
                                {product.description}
                            </p>
                        )}

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            padding: '24px',
                            background: 'var(--bg-primary)',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: '32px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
                                <FiCheck /> {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                <FiCheck /> Fresh from farm
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                <FiCheck /> Delivery within 60 minutes
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="product-detail-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div className="quantity-controls" style={{ padding: '8px' }}>
                                <button
                                    className="quantity-btn"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    style={{ width: '48px', height: '48px' }}
                                >
                                    <FiMinus />
                                </button>
                                <span className="quantity-value" style={{ fontSize: '1.25rem', minWidth: '48px' }}>
                                    {quantity}
                                </span>
                                <button
                                    className="quantity-btn"
                                    onClick={() => setQuantity(quantity + 1)}
                                    style={{ width: '48px', height: '48px' }}
                                >
                                    <FiPlus />
                                </button>
                            </div>

                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleAddToCart}
                                style={{ flex: 1 }}
                            >
                                <FiShoppingCart />
                                Add to Cart - ₹{(discountedPrice * quantity).toFixed(0)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
