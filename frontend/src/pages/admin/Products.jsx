import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiBox, FiList, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        nameHindi: '',
        description: '',
        price: '',
        unit: 'kg',
        category: 'vegetables',
        stock: '100',
        discount: '0',
        isFeatured: false,
    });
    const [imageFile, setImageFile] = useState(null);
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        fetchProducts();
    }, [isAdmin, navigate]);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            if (editingProduct) {
                await axios.put(`/api/products/${editingProduct._id}`, data);
                toast.success('Product updated successfully!');
            } else {
                await axios.post('/api/products', data);
                toast.success('Product created successfully!');
            }
            setShowModal(false);
            setEditingProduct(null);
            resetForm();
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            nameHindi: product.nameHindi || '',
            description: product.description || '',
            price: product.price.toString(),
            unit: product.unit,
            category: product.category,
            stock: product.stock.toString(),
            discount: product.discount.toString(),
            isFeatured: product.isFeatured,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await axios.delete(`/api/products/${id}`);
            toast.success('Product deleted successfully!');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            nameHindi: '',
            description: '',
            price: '',
            unit: 'kg',
            category: 'vegetables',
            stock: '100',
            discount: '0',
            isFeatured: false,
        });
        setImageFile(null);
    };

    if (loading) return <Loader />;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-nav">
                    <Link to="/admin">
                        <FiPackage /> Dashboard
                    </Link>
                    <Link to="/admin/products" className="active">
                        <FiBox /> Products
                    </Link>
                    <Link to="/admin/orders">
                        <FiList /> Orders
                    </Link>
                </div>
            </aside>

            <div className="admin-content">
                <div className="admin-header">
                    <h1>Products</h1>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingProduct(null);
                            resetForm();
                            setShowModal(true);
                        }}
                    >
                        <FiPlus /> Add Product
                    </button>
                </div>

                <div className="admin-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{product.name}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                                    <td>₹{product.price}/{product.unit}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.isFeatured ? '⭐' : '-'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className="btn btn-icon"
                                                onClick={() => handleEdit(product)}
                                                title="Edit"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className="btn btn-icon"
                                                onClick={() => handleDelete(product._id)}
                                                title="Delete"
                                                style={{ color: 'var(--error)' }}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
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
                    onClick={() => setShowModal(false)}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: 'var(--radius-lg)',
                            padding: '32px',
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="btn btn-icon" onClick={() => setShowModal(false)}>
                                <FiX />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Tomato"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Hindi Name</label>
                                    <input
                                        type="text"
                                        name="nameHindi"
                                        className="input"
                                        value={formData.nameHindi}
                                        onChange={handleChange}
                                        placeholder="e.g., टमाटर"
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    className="input"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Product description..."
                                    rows={3}
                                />
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label>Price (₹) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        className="input"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        placeholder="50"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Unit *</label>
                                    <select
                                        name="unit"
                                        className="input"
                                        value={formData.unit}
                                        onChange={handleChange}
                                    >
                                        <option value="kg">Per Kg</option>
                                        <option value="500g">Per 500g</option>
                                        <option value="250g">Per 250g</option>
                                        <option value="piece">Per Piece</option>
                                        <option value="bunch">Per Bunch</option>
                                        <option value="dozen">Per Dozen</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label>Category *</label>
                                    <select
                                        name="category"
                                        className="input"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="vegetables">Vegetables</option>
                                        <option value="fruits">Fruits</option>
                                        <option value="leafy">Leafy Greens</option>
                                        <option value="exotic">Exotic</option>
                                        <option value="herbs">Herbs</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        className="input"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label>Discount (%)</label>
                                    <input
                                        type="number"
                                        name="discount"
                                        className="input"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Image</label>
                                    <input
                                        type="file"
                                        className="input"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleChange}
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                    Featured Product (Show on homepage)
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
