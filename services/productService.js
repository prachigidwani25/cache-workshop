const { readDb, writeDb } = require('../database/db');

async function getAllProducts() {
  return await readDb();
}

async function getProductById(id) {
  const products = await readDb();
  const product = products.find((item) => item.id === id);
  return product || null;
}

async function createProduct(productData) {
  const products = await readDb();
  const nextId = products.length > 0 ? Math.max(...products.map((item) => item.id)) + 1 : 1;
  const newProduct = {
    id: nextId,
    name: productData.name,
    price: productData.price
  };

  products.push(newProduct);
  await writeDb(products);
  return newProduct;
}

async function updateProduct(id, productData) {
  const products = await readDb();
  const index = products.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const updatedProduct = {
    id,
    name: productData.name,
    price: productData.price
  };

  products[index] = updatedProduct;
  await writeDb(products);
  return updatedProduct;
}

async function patchProduct(id, updateData) {
  const products = await readDb();
  const index = products.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const existingProduct = products[index];
  const updatedProduct = {
    ...existingProduct,
    ...updateData,
    id: existingProduct.id
  };

  products[index] = updatedProduct;
  await writeDb(products);
  return updatedProduct;
}

async function deleteProduct(id) {
  const products = await readDb();
  const index = products.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const [deletedProduct] = products.splice(index, 1);
  await writeDb(products);
  return deletedProduct;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct
};
