import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartsCollection = "Carritos";

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Productos",
        },
      },
    ],
    default: [],
  },
});

cartsSchema.pre("find", function () {
  this.populate("products.product");
});

cartsSchema.pre("findOne", function () {
  this.populate("products.product");
});

cartsSchema.plugin(mongoosePaginate);
const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;
