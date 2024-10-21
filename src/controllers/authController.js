import { Router } from "express";
import authService from "../services/authService.js";

const router = Router();

/***********************
######## REGISTER ######
************************/
// GET
router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Second Hand Electronics" });
});

// POST
router.post("/register", async (req, res) => {
  const { email, username, password, rePass } = req.body;

  await authService.register(email, username, password, rePass);

  res.redirect("/auth/login");
});

/*##################
####### LOGIN ###
###################*/

// GET

router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Second Hand Electronics" });
});

// POST
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const token = await authService.login(email, password);

  res.cookie("auth", token);

  res.redirect("/");
});

/*##################
####### LOGOUT ###
###################*/

router.get("/logout", (req, res) => {
  res.clearCookie("auth");

  res.redirect("/");
});

export default router;
