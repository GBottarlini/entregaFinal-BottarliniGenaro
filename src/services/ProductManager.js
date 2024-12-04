import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, '../data/products.json');

class ProductManager {
    constructor() {
        this.products = [];
        this.init();
    }

    async init() {
        try {
            const data = await fs.readFile(productsFilePath, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            this.products = [];
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(productsFilePath, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar los productos:', error);
        }
    }

    validateProduct(product) {
        const requiredFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category'];
        for (const field of requiredFields) {
            if (!product[field]) {
                throw new Error(`El campo ${field} es obligatorio.`);
            }
        }
    }

    getAllProducts(limit) {
        return limit ? this.products.slice(0, limit) : this.products;
    }

    getProductById(pid) {
        return this.products.find(p => p.id === pid);
    }

    async addProduct(product) {
        this.validateProduct(product);
        product.id = Date.now().toString();
        this.products.push(product);
        await this.saveProducts();
        return product;
    }

    async updateProduct(pid, updatedFields) {
        const index = this.products.findIndex(p => p.id === pid);
        if (index === -1) return null;
        this.products[index] = { ...this.products[index], ...updatedFields };
        await this.saveProducts();
        return this.products[index];
    }

    async deleteProduct(pid) {
        this.products = this.products.filter(p => p.id !== pid);
        await this.saveProducts();
    }
}

export default ProductManager;