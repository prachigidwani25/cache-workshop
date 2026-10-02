const productService = require('../services/productService');
const { invalidateCache } = require('../middleware/cacheMiddleware');

async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve products' });
  }
}

async function getProductById(req, res) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Product ID must be a valid number' });
    }

    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve product' });
  }
}

async function createProduct(req, res) {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined || isNaN(Number(price))) {
      return res.status(400).json({ error: 'Name and a valid numeric price are required' });
    }

    const newProduct = await productService.createProduct({
      name,
      price: Number(price)
    });

    invalidateCache();
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create product' });
  }
}

async function updateProduct(req, res) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Product ID must be a valid number' });
    }

    const { name, price } = req.body;
    if (!name || price === undefined || isNaN(Number(price))) {
      return res.status(400).json({ error: 'Name and a valid numeric price are required' });
    }

    const updatedProduct = await productService.updateProduct(id, {
      name,
      price: Number(price)
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    invalidateCache();
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update product' });
  }
}

async function patchProduct(req, res) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Product ID must be a valid number' });
    }

    const updateData = {};
    if (req.body.name !== undefined) {
      updateData.name = req.body.name;
    }
    if (req.body.price !== undefined) {
      if (isNaN(Number(req.body.price))) {
        return res.status(400).json({ error: 'Price must be a valid number' });
      }
      updateData.price = Number(req.body.price);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'At least one valid field to update is required' });
    }

    const updatedProduct = await productService.patchProduct(id, updateData);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    invalidateCache();
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to patch product' });
  }
}

async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Product ID must be a valid number' });
    }

    const deletedProduct = await productService.deleteProduct(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    invalidateCache();
    return res.status(200).json({
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete product' });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct
};
