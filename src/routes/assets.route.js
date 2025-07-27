import { Router } from "express";
import { get, create, update, deleteData, listAssets } from "#controllers/assets";
import { authentication, authorization } from "#middlewares/auth";

const router = Router();

router.route('/assets-projecct-id', listAssets)
router
  .route("/:id?")
  .get(get)
  .post(authorization('manager'), create)
  .put(authorization('manager'), update)
  .delete(authorization('admin'), deleteData);

export default router;