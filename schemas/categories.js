const mongoose = require('mongoose');

// Định nghĩa Schema cho Category
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Category = mongoose.model('category', categorySchema);

// Tạo mới category
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new Category({ name, description });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy danh sách category
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isDeleted: false });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy category theo ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category || category.isDeleted) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật category
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, 
            { name, description }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa category (soft delete)
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
