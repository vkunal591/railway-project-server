import { Router } from "express";
import { get, create, update, deleteData } from "#controllers/assets";
import { authentication, authorization } from "#middlewares/auth";

const router = Router();

router
  .route("/:id?")
  .get(get)
  .post(authorization('manager'), create)
  .put(authorization('manager'), update)
  .delete(authorization('admin'), deleteData);

export default router;