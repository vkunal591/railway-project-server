import { Router } from "express";
import { get, create, update, deleteData, search } from "#controllers/projects";
import { authentication, authorization } from "#middlewares/auth";

const router = Router();

router.route('/search', search)
router
  .route("/:id?")
  .get(get)
  .post(authorization("admin"), create)
  .put(authorization('admin'), update)
  .delete(authorization('admin'), deleteData);

export default router;