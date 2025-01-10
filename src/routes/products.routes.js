import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

// Obtener todos los productos con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, category, available } = req.query;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        };

        const filter = {};
        if (category) {
            filter.category = category;
        }
        if (available !== undefined) {
            filter.status = available === 'true';
        }

        const products = await Product.paginate(filter, options);

        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.hasPrevPage ? products.page - 1 : null,
            nextPage: products.hasNextPage ? products.page + 1 : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.page - 1}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.page + 1}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        res.render('productDetail', { product }); 
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;