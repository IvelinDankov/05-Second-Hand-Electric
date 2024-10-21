import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.render("home", { title: "Second Hand Electronics" });
});

export default router