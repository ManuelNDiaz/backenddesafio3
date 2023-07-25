const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const PORT = 3000; // El puerto se puede cambiar tranquilamente

// Crea una instancia del ProductManager y configura el archivo donde se encuentran los productos
const productManager = new ProductManager('products.json');

// Endpoint para obtener todos los productos con un límite opcional
app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();
    if (!isNaN(limit) && limit > 0) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint para obtener un producto específico por su id (pid)
app.get('/products/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid)) {
      return res.status(400).json({ error: 'ID de producto invalido' });
    }
    const product = await productManager.getProductById(pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'No se encontró el producto' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor interno' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
