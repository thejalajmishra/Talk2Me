import { showAlert } from '../../utils/alert';
// replace alert calls
// line 40 -> showAlert('error', error.response?.data?.detail || "Failed to save category");
// line 58 -> showAlert('error', error.response?.data?.detail || "Cannot delete category with existing topics");
import axios from 'axios';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const AdminCategories = ({ user }) => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await axios.put(`http://localhost:8000/categories/${editingCategory.id}`, newCategory, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                setEditingCategory(null);
            } else {
                await axios.post('http://localhost:8000/categories', newCategory, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
            }
            setNewCategory({ name: '', description: '' });
            fetchCategories();
        } catch (error) {
            console.error("Failed to save category", error);
            alert(error.response?.data?.detail || "Failed to save category");
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setNewCategory({ name: category.name, description: category.description || '' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await axios.delete(`http://localhost:8000/categories/${id}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                fetchCategories();
            } catch (error) {
                console.error("Failed to delete category", error);
                alert(error.response?.data?.detail || "Cannot delete category with existing topics");
            }
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
                <p className="text-gray-600 mt-2">Organize topics into categories</p>
            </div>

            {/* Add/Edit Category Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Plus className="mr-2 text-indigo-600" size={24} />
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        required
                    />
                    <textarea
                        placeholder="Description (optional)"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        rows="2"
                    />
                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md shadow-indigo-200"
                        >
                            {editingCategory ? 'Update' : 'Add'} Category
                        </button>
                        {editingCategory && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingCategory(null);
                                    setNewCategory({ name: '', description: '' });
                                }}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Categories ({categories.length})</h2>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                {category.description && (
                                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Created: {new Date(category.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminCategories;
