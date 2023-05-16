import { Router } from "express";
import multer from "multer";
import { RefreshProductsController } from "./controllers/RefreshProductsController";
import { GetProductsController } from "./controllers/GetProductsController";

const multerConfig = multer();
const router = Router();

const refreshProducts = new RefreshProductsController();
const getProducts = new GetProductsController();

router.post("/upload", multerConfig.single("file"), refreshProducts.handle);
router.get("/products", getProducts.handle);

export { router };
