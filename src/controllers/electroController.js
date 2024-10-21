import { Router } from "express";
import electroService from "../services/electroService.js";
import { getErrorMessage } from "../utils/getErrMsg.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router = Router();

/* ##########################
######### CREATE ############
########################### */
/* ======== GET ========# */
router.get("/create", isAuth, (req, res) => {
  res.render("electro/create", { title: "Second Hand Electronics" });
});
/* ======== POST ======== */
router.post("/create", isAuth, async (req, res) => {
  const elData = req.body;
  const userId = req.user._id;

  try {
    await electroService.create(elData, userId);
    res.redirect("/electro/catalog");
  } catch (err) {
    const error = getErrorMessage(err);
    res.render("electro/create", {
      title: "Second Hand Electronics",
      electro: elData,
      error,
    });
  }
});

/* ##########################
######### CATALOG ############
########################### */

/* ==== GET ========== */
router.get("/catalog", async (req, res) => {
  try {
    const items = await electroService.getAll().lean();
    res.render("electro/catalog", {
      title: "Second Hand Electronics",
      items,
    });
  } catch (err) {
    const error = getErrorMessage(err);
    res.render("electro/catalog", {
      title: "Second Hand Electronics",
      items,
      error,
    });
  }
});

/* ##########################
######### DETAIL ############
########################### */

router.get("/:productId/details", async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user?._id;

  try {
    const product = await electroService.getOne(productId).lean();

    const isOwner = product.owner.toString() === userId;

    const bought = product.buyingList.some(
      (userId) => userId.toString() === req.user?._id
    );
    res.render("electro/details", {
      title: "Second Hand Electronics",
      product,
      isOwner,
      bought,
    });
  } catch (err) {
    const error = getErrorMessage(err);

    console.log(err.message);
  }
});

/* ##########################
######### BUY ############
########################### */

router.get("/:productId/buy", isAuth, async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;

  try {
    const isOwner = await await isProductOwner(productId, userId);

    if (isOwner) {
      res.redirect("/404");
    }

    await electroService.buy(productId, userId);
    res.redirect(`/electro/${productId}/details`);
  } catch (err) {
    const error = getErrorMessage(err);
    console.log(error);
  }
});

/* ##########################
######### DELETE ############
########################### */

router.get("/:productId/delete", isAuth, async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;

  const isOwner = await isProductOwner(productId, userId);

  if (!isOwner) {
    res.redirect("/404");
  }

  try {
    await electroService.del(productId);
    res.redirect("/electro/catalog");
  } catch (err) {
    const error = getErrorMessage(err);
    console.log(error);
  }
});

/* ##########################
######### EDIT ############
########################### */
/* ==== get ======= */
router.get("/:productId/edit", isAuth, async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;
  const isOwner = await isProductOwner(productId, userId);

  if (!isOwner) {
    res.redirect("/404");
  }

  try {
    const item = await electroService.getOne(productId).lean();

    res.render("electro/edit", { title: "Second Hand Electronics", item });
  } catch (err) {
    const error = getErrorMessage(err);
    res.render("electro/edit", { title: "Second Hand Electronics", item, error });
  }
});
/* ==== post ======= */
router.post("/:productId/edit", isAuth, async (req, res) => {
  const productId = req.params.productId;
  const data = req.body;
  const userId = req.user._id;

  const isOwner = await isProductOwner(productId, userId);

  if (!isOwner) {
    res.redirect("/404");
  }

  try {
    await electroService.edit(productId, data);
    res.redirect(`/electro/${productId}/details`);
  } catch (err) {
    const error = getErrorMessage(err);
    res.render("electro/edit", {
      title: "Second Hand Electronics",
      error,
    });
  }
});

/* ##########################
######### SEARCH ############
########################### */

router.get("/search", async (req, res) => {
  const filter = req.query;
  const items = await electroService.getAll(filter).lean();

  res.render("electro/search", {
    title: "Second Hand Electronics",
    items,
    filter,
  });
});

async function isProductOwner(productId, ownerId) {
  const product = await electroService.getOne(productId);
  const isOwner = product.owner.toString() === ownerId;
  return isOwner;
}

export default router;
