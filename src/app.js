import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import displayRoutes from "express-routemap";
import __dirname from "./utils.js";

// Importación de rutas:
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";

// Variables:
const app = express();
const PORT = 8080;
const MONGO_URL =
  "mongodb+srv://lauullerandi:Lauumanda17@laull24.x36qdis.mongodb.net/?retryWrites=true&w=majority";

// Middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

// Handlebars:
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Conexión a mongoDb: 
const connection = mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("🚀 ~ file: app.js:25 ~ CONECTADO!:");
  })
  .catch((err) => {
    console.log("🚀 ~ file: app.js:28 ~ ERROR:", err);
  });

// Rutas:
app.use("/api/carts/", cartsRouter);
app.use("/api/products/", productsRouter);
app.use("/api/views/", viewsRouter);

// Levanta el servidor:
app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`================================`);
  console.log(`🚀 App listening on port: ${PORT}`);
  console.log(`================================`);
});
