import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import ProductManager from './services/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

// Configuración de Handlebars
app.engine('handlebars', engine());
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

// Servidor HTTP
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Configuración de Socket.io
const io = new Server(httpServer);
const productManager = new ProductManager();

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar productos al cliente cuando se conecta
    socket.emit('updateProducts', productManager.getAllProducts());

    // Escuchar evento de nuevo producto
    socket.on('addProduct', async (product) => {
        try {
            await productManager.addProduct(product);
            // Emitir la lista actualizada a todos los clientes
            io.emit('updateProducts', productManager.getAllProducts());
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    // Escuchar evento de eliminación de producto
    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            // Emitir la lista actualizada a todos los clientes
            io.emit('updateProducts', productManager.getAllProducts());
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

export default app;