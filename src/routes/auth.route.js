import { Router } from "express";
import { getUser, register, login, updateUser, deleteUser, getAllUsers } from "#controllers/auth";
import { authentication, authorization } from "#middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/admin/login", login);
router.get("/get-current-user", getUser);
router.route("/user/:id?").get(authorization('admin'), getAllUsers).put(authorization('admin'), updateUser).delete(authorization('admin'), deleteUser);

export default router;
