import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import mongoose from 'mongoose';

import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

// Configuración de Handlebars
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Conectar a la base de datos
connectDB();

// Servidor HTTP
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Configuración de Socket.io
const io = new Server(httpServer);
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('addProduct', async (product) => {
        try {
            const newProduct = new Product(product);
            await newProduct.save();
            const products = await Product.find();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });
    socket.on('deleteProduct', async (productId) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                throw new Error('ID no válido');
            }
            const objectId = new mongoose.Types.ObjectId(productId);
            await Product.findByIdAndDelete(objectId);
            const products = await Product.find();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

export default app;