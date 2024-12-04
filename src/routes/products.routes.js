import { Router } from 'express';
import ProductManager from '../services/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// Obtener todos los productos
router.get('/', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = productManager.getAllProducts(limit);
    res.json(products);
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    const product = productManager.getProductById(req.params.pid);
    res.json(product || { error: 'Producto no encontrado' });
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updatedProduct);
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    await productManager.deleteProduct(req.params.pid);
    res.status(204).send();
});

export default router;