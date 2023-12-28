import { Router } from "express";
import cartsModel from "../dao/models/carts.model.js";
import productsModel from "../dao/models/products.model.js";

const router = Router();

// Vista en el router de views ‘/products’ para visualizar todos los productos con su respectiva paginación.
router.get("/products", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const {
    docs,
    totalPages,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
    prevLink,
    nextLink,
  } = await productsModel.paginate({}, { limit, page, lean: true });

  res.status(200).render("products", {
    style: "index.css",
    products: docs,
    page,
    totalPages,
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink,
  });
});

// Vista en ‘/carts/:cid para visualizar un carrito específico, donde se listan SOLO los productos que pertenecen a dicho carrito:
router.get("/carts/:cid", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { cid } = req.params;
  const cart = await cartsModel.findById(cid);

  if (cart) {
    const products = cart.products.map((product) => product.product._id);

    const {
      docs,
      totalPages,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage,
      prevLink,
      nextLink,
    } = await productsModel.paginate(
      { _id: { $in: products } },
      { limit, page, lean: true }
    );

    res.status(200).render("cart", {
      style: "index.css",
      products: docs,
      page,
      totalPages,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    });
  } else {
    console.log("Carrito inexistente");
    res.status(400).json({
      error: "Carrito inexistente",
    });
  }
});

export default router;
