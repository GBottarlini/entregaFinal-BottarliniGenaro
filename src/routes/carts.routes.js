import { Router } from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = Router();

// Agregar producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        
        const existingProduct = cart.products.find(p => p.product.toString() === req.params.pid);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: product._id, quantity: 1 });
        }
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito', message: error.message });
    }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
        await cart.save();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto del carrito', message: error.message });
    }
});

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body; // Se espera que se pase la nueva cantidad
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const existingProduct = cart.products.find(p => p.product.toString() === req.params.pid);
        if (!existingProduct) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

        // Actualizar la cantidad del producto
        existingProduct.quantity = quantity;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto', message: error.message });
    }
});

// Actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const { products } = req.body; // Se espera un arreglo de productos
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        // Actualizar los productos en el carrito
        cart.products = products.map(item => ({
            product: item.product,
            quantity: item.quantity
        }));

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito', message: error.message });
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        // Vaciar el carrito
        cart.products = [];
        await cart.save();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar todos los productos del carrito', message: error.message });
    }
});

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart(req.body);
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el carrito', message: error.message });
    }
});


export default router;