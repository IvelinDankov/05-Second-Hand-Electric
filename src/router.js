import { Router } from "express";

import homeController from "./controllers/homeController.js";
import authController from "./controllers/authController.js";
import electroController from "./controllers/electroController.js";

const router = Router();

router.use(homeController);
router.use("/auth", authController);
router.use("/electro", electroController);

router.all('*', (req, res) => {
   res.render("home/404", { title: "404 Page - Gaming Team" });
});

export default router;
