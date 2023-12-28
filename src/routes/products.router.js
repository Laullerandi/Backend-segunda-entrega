import { Router } from "express";
import ProductManager from "../dao/managers/products.manager.js";

const router = Router();

const manager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // ?query=category&category=nombre de la categoría
    if (query) {
      if (query.toLowerCase() === "category") {
        const { category } = req.query;
        const products = await manager.getProductsByCategory(category);

        if (sort === "1" || sort === "-1") {
          const value = category;
          const sortedProducts = await manager.getProductsByPrice(
            Number(sort),
            query,
            value
          );
          return res.status(200).json({
            status: "Products sorted by price:",
            payload: { sortedProducts },
          });
        }

        return res.status(200).json({
          status: "Products by category:",
          payload: { products },
        });
      }
      // ?query=status&status=disponible || ?query=status&status=no disponible
      if (query.toLowerCase() === "status") {
        const { status } = req.query;
        const products = await manager.getProductsByStatus(status);

        if (sort === "1" || sort === "-1") {
          const value = status;
          const sortedProducts = await manager.getProductsByPrice(
            Number(sort),
            query,
            value
          );
          return res.status(200).json({
            status: "Products sorted by price:",
            payload: { sortedProducts },
          });
        }

        return res.status(200).json({
          status: "Products by availability:",
          payload: { products },
        });
      }
    } else {
      const products = await manager.getProducts(limit, page);

      return res.status(200).json(products);
    }
  } catch (err) {
    return res.status(400).json({
      status: "error",
      payload: err,
    });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const productById = await manager.getProductById(pid);

    if (!productById) {
      return res.status(400).json({
        status: "error",
        payload: "Error: Id inexistente",
      });
    }

    return res.status(200).json({
      status: "success",
      payload: productById,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const product = req.body;
    if (
      product.title &&
      product.description &&
      product.code &&
      product.price &&
      product.status &&
      product.stock &&
      product.category
    ) {
      const productAdded = await manager.addProduct(product);

      return res.status(200).json({
        status: "success",
        payload: productAdded,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Ingrese todos los campos requeridos" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await manager.deleteProduct(pid);
    return res.status(200).json({
      status: "Product deleted:",
      payload: deletedProduct,
    });
  } catch (err) {
    console.log(err);
  }
});

export default router;
