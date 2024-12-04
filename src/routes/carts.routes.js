import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const router = Router();
const cartsFilePath = path.join(__dirname, '../data/carts.json');

// Leer carritos desde el archivo
const readCarts = async () => {
    try {
        const data = await fs.readFile(cartsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer carritos:', error);
        return [];
    }
};

// Guardar carritos en el archivo
const saveCarts = async (carts) => {
    try {
        await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
    } catch (error) {
        console.error('Error al guardar carritos:', error);
    }
};

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    const carts = await readCarts();
    const newCart = { id: Date.now().toString(), products: [] };
    carts.push(newCart);
    await saveCarts(carts);
    res.status(201).json(newCart);
});

// Obtener productos de un carrito
router.get('/:cid', async (req, res) => {
    const carts = await readCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
});

// Agregar producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const carts = await readCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const productId = req.params.pid;
    const existingProduct = cart.products.find(p => p.product === productId);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.products.push({ product: productId, quantity: 1 });
    }
    await saveCarts(carts);
    res.json(cart);
});

export default router;