import { Router } from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = Router();

// Página de inicio que muestra todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Página de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Página de productos con paginación
router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
        };

        const products = await Product.paginate({}, options);

        res.render('home', {
            products: products.docs,
            totalPages: products.totalPages,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${products.page - 1}` : null,
            nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${products.page + 1}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Obtener el carrito y los productos completos
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito', message: error.message });
    }
});

// Ruta para visualizar un carrito específico
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito', message: error.message });
    }
});

export default router;