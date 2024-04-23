import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUserDetails,
  getWatchHistory,
  updateUserDetails,
  changeUserPassword,
  refreshAccessToken,
  getUserChannelProfile,
  deleteUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/update-details").patch(
  verifyJWT,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  updateUserDetails
);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/history").get(verifyJWT, getWatchHistory);
router.route("/your-profile").get(verifyJWT, getUserDetails);
router.route("/delete-account").delete(verifyJWT, deleteUser);
router.route("/c/:userName").get(verifyJWT, getUserChannelProfile);
router.route("/change-password").post(verifyJWT, changeUserPassword);

export default router;
