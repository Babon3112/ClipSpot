import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateAccount,
  getCurrentUser,
  getWatchHistory,
  updateUserAvatar,
  changeUserPassword,
  refreshAccessToken,
  updateUserCoverImage,
  getUserChannelProfile,
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
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeUserPassword);
router.route("/your-profile").get(verifyJWT, getCurrentUser);
router.route("/update-details").patch(verifyJWT, updateAccount);
router
  .route("/change-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-banner")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:userName").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
