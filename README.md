# Entrega Final - Proyecto de E-commerce

Este es un proyecto de e-commerce desarrollado como parte de la entrega final. La aplicación permite a los usuarios ver productos, filtrarlos por categoría y precio, y agregar productos a un carrito de compras.

## Características

- Visualización de productos disponibles.
- Filtrado de productos por categoría y orden.
- Detalles del producto.
- Carrito de compras para agregar y eliminar productos.
- Actualización en tiempo real de productos utilizando Socket.io.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework web para Node.js.
- **MongoDB**: Base de datos NoSQL para almacenar productos y carritos.
- **Mongoose**: ODM para MongoDB y Node.js.
- **Express-Handlebars**: Motor de plantillas para renderizar vistas.
- **Socket.io**: Biblioteca para la comunicación en tiempo real.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/GBottarlini/entregaFinal-BottarliniGenaro.git
   ```

2. Navega a la carpeta del proyecto:

   ```bash
   cd entregaFinal-bottarlini
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Conecta tu base de datos MongoDB. Asegúrate de tener una instancia de MongoDB en funcionamiento y actualiza la configuración de conexión en el archivo `config/db.js`.

5. Inicia el servidor:

   ```bash
   npm start
   ```

6. Abre tu navegador y visita `http://localhost:8080` para ver la aplicación en funcionamiento.

## Uso

- Navega por los productos disponibles en la página de inicio.
- Utiliza el filtro para buscar productos por categoría y orden.
- Haz clic en "Ver Detalles" para ver más información sobre un producto.
- Agrega productos al carrito y visualiza el carrito de compras.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`).
3. Realiza tus cambios y haz un commit (`git commit -m 'Agregada nueva característica'`).
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia ISC. Para más detalles, consulta el archivo `LICENSE`.

## Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactarme a través de [tu-email@example.com](mailto:tu-email@example.com).
