import cartsModel from "../models/carts.model.js";
import productsModel from "../models/products.model.js";

export default class CartManager {
  // Crea un carrito lo guarda en el arreglo de carritos:
  createCart = async (cart) => {
    try {
      const newCart = await cartsModel.create(cart);
      return newCart;
    } catch (err) {
      console.log(err);
    }
  };

  // Lee el modelo de carritos y devuelve todos los carritos en formato de arreglo, completos mediante un “populate”:
  getCarts = async () => {
    try {
      const carts = await cartsModel.find({});
      return carts;
    } catch (err) {
      console.log(err);
    }
  };

  // Lee el modelo de carritos y devuelve el carrito que coincida con el id enviado:
  getCartById = async (cid) => {
    try {
      const cart = await cartsModel.findOne({ _id: cid });

      if (cart) {
        return cart;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Agrega el producto que contenga el pid al carrito identificado por su cid:
  addProductToCart = async (cid, pid) => {
    try {
      const cart = await cartsModel.findOne({
        _id: cid,
      });

      if (cart) {
        const existingProduct = cart.products.find(
          (product) => String(product.product._id) === pid
        );

        // No agrega las cantidades correctamente dentro del modelo "producto"
        if (existingProduct) {
          const updateProduct = { existingProduct, quantity: +1 };
          console.log(updateProduct);
        } else {
          const product = await productsModel.findById(pid);
          if (product) {
            const newProduct = { product, quantity: 1 };
            cart.products.push(newProduct);
            console.log(newProduct);
          }
        }

        let updatedCart = await cart.save();

        return updatedCart;
      } else return console.log("Error: el carrito no existe");
    } catch (err) {
      console.log(err);
    }
  };

  // Actualiza el carrito con un arreglo de productos con el formato especificado:
  updateCart = async (cid, page, limit) => {
    try {
      const cart = await cartsModel.findById(cid);

      if (cart) {
        const products = cart.products;
        const options = { page: Number(page), limit: Number(limit) };
        const result = await cartsModel.paginate({}, options);

        const updatedCart = {
          status: "Updated products:",
          payload: products,
          totalPages: result.totalPages,
          prevPage: result.prevPage,
          nextPage: result.nextPage,
          page: result.page,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          prevLink: result.prevLink,
          nextLink: result.nextLink,
        };

        console.log(updatedCart);

        return updatedCart;
      } else {
        console.log("El carrito no existe");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Actualiza SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body:
  updateProductFromCart = async (cid, pid, productQuantity) => {
    try {
      const cart = await cartsModel.findById(cid);

      if (cart) {
        const newQuantity = productQuantity.quantity;
        const product = cart.products.find(
          (product) => String(product.product._id) === pid
        );

        if (product) {
          product.product.quantity = newQuantity;

          const updatedCart = await cart.save();
          return updatedCart;
        } else {
          console.log("El producto no está en el carrito");
        }
      } else {
        console.log("Carrito inexistente");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Elimina el carrito indicado:
  deleteCart = async (cid) => {
    try {
      const carts = await cartsModel.deleteOne({ _id: cid });

      if (cid === 0) {
        console.log("Error: id inexistente");
      } else if (cid < 0) {
        console.log("Error: carrito no encontrado");
      } else {
        return carts;
      }
    } catch (err) {}
  };

  // Elimina del carrito el producto seleccionado:
  deleteProductFromCart = async (cid, pid) => {
    try {
      const cart = await cartsModel.findById(cid);

      if (cart) {
        const product = cart.products.findIndex(
          (product) => String(product.product._id) === pid
        );

        cart.products.splice(product, 1);
        let updatedCart = await cart.save();

        return updatedCart;
      } else return console.log("Error: el carrito no existe");
    } catch (err) {
      console.log(err);
    }
  };

  // Elimina todos los productos del carrito:
  deleteAllProductsFromCart = async (cid) => {
    try {
      const cart = await cartsModel.findOne({ _id: cid });
      cart.products = [];
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (err) {
      console.log(err);
    }
  };
}
