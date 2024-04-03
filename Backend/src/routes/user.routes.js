import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUserDetails,
  getWatchHistory,
  updateUserAvatar,
  updateUserDetails,
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
router
  .route("/change-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-banner")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/history").get(verifyJWT, getWatchHistory);
router.route("/your-profile").get(verifyJWT, getUserDetails);
router.route("/update-details").patch(verifyJWT, updateUserDetails);
router.route("/c/:userName").get(verifyJWT, getUserChannelProfile);
router.route("/change-password").post(verifyJWT, changeUserPassword);

export default router;
