import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const productsCount = await Product.countDocuments(); // Obtener el número de productos
        const cartsCount = 0; // Aquí puedes agregar lógica para contar los carritos si es necesario

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