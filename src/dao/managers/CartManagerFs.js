import fs from "fs";

export default class CartManager {
  // Constructor:
  constructor() {
    this.path = "src/files/carts.json";
  }

  // Métodos:
  addCart = async (cart) => {
    // Recibe un carrito, le asigna un id autoincrementable y lo guarda en el arreglo:
    const carts = await this.getCarts();

    if (carts.length === 0) {
      cart.id = 1;
    } else {
      cart.id = carts[carts.length - 1].id + 1;
    }
    cart.products = [];
    carts.push(cart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    return cart;
  };

  addProductToCart = async (cid, pid) => {
    if (pid < 0) {
      console.log("Error: el id del producto no puede ser un número negativo.");
      return;
    }

    const carts = await this.getCarts();
    const cartIndex = carts.findIndex((cart) => cart.id === cid);

    if (cartIndex !== -1) {
      const cart = carts[cartIndex];
      const existingProduct = cart.products.find(
        (item) => item.product === pid
      );

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        const product = {
          product: pid,
          quantity: 1,
        };
        cart.products.push(product);
      }
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
      return cart;
    } else {
      return console.log("Error: carrito no encontrado");
    }
  };

  getCarts = async () => {
    // Lee el archivo de carritos y devuelve todos los carritos en formato de arreglo:
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(data);
      return carts;
    } else {
      return [];
    }
  };
};
