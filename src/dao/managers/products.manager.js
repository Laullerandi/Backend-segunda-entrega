import productsModel from "../models/products.model.js";

export default class ProductManager {
  // Lee el modelo de productos y devuelve todos los productos:
  getProducts = async (limit = 10, pageNum = 1) => {
    try {
      const options = { limit: Number(limit), page: Number(pageNum) };

      const products = await productsModel.paginate({}, options);

      const {
        docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
      } = products;

      const prevLink = hasPrevPage
        ? `/api/products/?limit=${limit}&page=${prevPage}`
        : null;
      const nextLink = hasNextPage
        ? `/api/products/?limit=${limit}&page=${nextPage}`
        : null;

      return {
        status: "All products:",
        payload: docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      };
    } catch (err) {
      console.log(err);
    }
  };

  // Lee el modelo de productos y devuelve todos los productos ordenados de acuerdo al query sort indicado:
  getProductsByPrice = async (sort, query, value) => {
    try {
      const match = { [query]: value };

      const products = await productsModel.aggregate([
        { $match: match },
        { $sort: { price: sort } },
      ]);
      return products;
    } catch (err) {
      console.log(err);
    }
  };
  // Lee el modelo de productos y devuelve todos los productos ordenados de acuerdo al query "category":
  getProductsByCategory = async (category, limit, page) => {
    try {
      const products = await productsModel.aggregate([
        { $match: { category: `${category}` } },
      ]);
      return products;
    } catch (err) {
      console.log(err);
    }
  };

  // Lee el modelo de productos y devuelve todos los productos ordenados de acuerdo al query "status":
  getProductsByStatus = async (status, limit, page) => {
    try {
      const products = await productsModel.aggregate([
        { $match: { status: `${status}` } },
      ]);
      return products;
    } catch (err) {
      console.log(err);
    }
  };

  // Recibe un id de producto, busca el producto con el id especificado y lo devuelve:
  getProductById = async (pid) => {
    try {
      const product = await productsModel.findById({ _id: pid });
      if (product) {
        return product;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Recibe un producto, chequea si existe y si no existe, lo agrega al arreglo de productos:
  addProduct = async (product) => {
    try {
      const checkProduct = await productsModel.findOne({
        code: `${Number(product.code)}`,
      });

      if (checkProduct) {
        return checkProduct;
      }

      const newProduct = await productsModel.create({
        ...product,
        code: Number(product.code),
      });

      return newProduct;
    } catch (err) {
      console.log(err);
    }
  };

  // Recibe el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y actualiza el producto que tenga ese id en el archivo. SIN BORRAR SU ID:
  updateProduct = async (pid, updatedFields) => {
    try {
      const updatedProduct = await productsModel.updateOne({
        _id: pid,
        updatedFields,
      });

      if (pid === 0) {
        console.log("Error: id inexistente");
      } else if (pid === -1) {
        // ver si funciona con < 0
        console.log("Error: producto no encontrado");
      } else {
        return updatedProduct;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Recibe un id y elimina el producto que tenga ese id en el archivo:
  deleteProduct = async (pid) => {
    try {
      const products = await productsModel.deleteOne({ _id: pid });

      if (pid === 0) {
        console.log("Error: id inexistente");
      } else if (pid === -1) {
        console.log("Error: producto no encontrado");
      } else {
        return products;
      }
    } catch (err) {
      console.log(err);
    }
  };
}
