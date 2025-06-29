import { Router } from "express";
import { getUser, register, login, updateUser, deleteUser } from "#controllers/auth";
import { authentication } from "#middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/admin/login", login);
router.get("/get-current-user", getUser);
router.route("/user/:id?").get(authentication, getUser).put(authentication, updateUser).delete(authentication, deleteUser);

export default router;
