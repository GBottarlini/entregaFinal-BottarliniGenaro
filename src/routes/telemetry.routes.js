import express from 'express';
import ProductManager from '../services/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const productsCount = productManager.products.length; // Obtener el número de productos
        const cartsCount = 0;

        res.json({
            status: 'success',
            data: {
                productsCount,
                cartsCount,
                message: 'Telemetry data retrieved successfully'
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving telemetry data',
            error: error.message
        });
    }
});

export default router;