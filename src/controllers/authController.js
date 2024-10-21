import { Router } from "express";
import authService from "../services/authService.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";
import { getErrorMessage } from "../utils/getErrMsg.js";

const router = Router();

/***********************
######## REGISTER ######
************************/
// GET
router.get("/register", isGuest, (req, res) => {
  res.render("auth/register", { title: "Second Hand Electronics" });
});

// POST
router.post("/register", isGuest, async (req, res) => {
  const { email, username, password, rePass } = req.body;

  try {
    await authService.register(email, username, password, rePass);

    const token = await authService.login(email, password);

    res.cookie("auth", token);

    res.redirect("/");
  } catch (err) {
    const error = getErrorMessage(err);
    res.render("auth/register", { title: "Second Hand Electronics", data: req.body,  error });
  }
});

/*##################
####### LOGIN ###
###################*/

// GET

router.get("/login", isGuest, (req, res) => {
  res.render("auth/login", { title: "Second Hand Electronics" });
});

// POST
router.post("/login", isGuest, async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await authService.login(email, password);

    res.cookie("auth", token);

    res.redirect("/");
  } catch (err) {
    const error = getErrorMessage(err)
    res.render("auth/login", { title: "Second Hand Electronics", email, error });
  }
});

/*##################
####### LOGOUT ###
###################*/

router.get("/logout", isAuth, (req, res) => {
  res.clearCookie("auth");

  res.redirect("/");
});

export default router;
