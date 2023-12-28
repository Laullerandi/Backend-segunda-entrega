import { Router } from "express";
import CartManager from "../dao/managers/carts.manager.js";

const router = Router();

const manager = new CartManager();

router.get("/", async (req, res) => {
  try {
    const carts = await manager.getCarts();

    return res.status(200).json({
      status: "All carts",
      payload: { carts },
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cartById = await manager.getCartById(cid);

    if (!cartById) {
      return res.status(400).json({
        status: "error",
        payload: "Error: id inexistente",
      });
    }

    return res.status(200).json({
      status: "success",
      payload: cartById,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const cart = await manager.createCart();
    return res.status(200).json({
      status: "Cart created:",
      payload: { cart },
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await manager.addProductToCart(cid, pid);
    res
      .status(200)
      .json({ message: "Product successfully added to cart: ", cart });
  } catch (err) {
    console.log(err);
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const {page = 1, limit = 10} = req.query;

    const updatedCart = await manager.updateCart(cid, products, page, limit);

    return res.status(200).json({
      status: "Updated cart:",
      payload: updatedCart,
    });
  } catch (err) {
    console.log(err);
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const productQuantity = req.body;

    const updatedCart = await manager.updateProductFromCart(cid, pid, productQuantity);

    return res.status(200).json({
      status: "Updated cart:",
      payload: updatedCart,
    });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await manager.deleteProductFromCart(cid, pid);
    return res.status(200).json({
      status: "Product deleted from cart: ",
      payload: updatedCart,
    });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCart = await manager.deleteAllProductsFromCart(cid);
    return res.status(200).json({
      status: "Cart emptied:",
      payload: updatedCart,
    });
  } catch (err) {
    console.log(err);
  }
});

export default router;
