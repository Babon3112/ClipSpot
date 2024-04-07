import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.util.js";
import {
  CLOUD_AVATAR_FOLDER_NAME,
  CLOUD_COVERIMAGE_FOLDER_NAME,
} from "../constants.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token",
      error
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validatiion - not empty string
  // check if user already exists: userName, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token from response
  // check for user creation
  // return response

  const { fullName, email, userName, password } = req.body;
  // console.log("email", email);
  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields is required");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or userName already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(
    avatarLocalPath,
    CLOUD_AVATAR_FOLDER_NAME
  );
  const coverImage = await uploadOnCloudinary(
    coverImageLocalPath,
    CLOUD_COVERIMAGE_FOLDER_NAME
  );

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    userName: userName.toLowerCase(),
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // userName or email
  // find the user
  // password check
  // acces and refresh token
  // send cookies

  const { email, userName, password } = req.body;
  if (!(email || userName)) {
    throw new ApiError(400, "userName or email required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedinUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refreh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newrefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .coookie("accessToken", accessToken, options)
      .coookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newrefreshToken },
          "Access Token successfully retrieved"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password cannot be same as old password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

const getUserDetails = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(200, req.user, "Current User fetched successfully");
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  let toUpdate = {};

  if (fullName) {
    toUpdate["fullName"] = fullName;
  }

  if (email) {
    const user = await User.findOne({ email });
    if (user) {
      throw new ApiError(400, "This email is already taken");
    }
    toUpdate["email"] = email;
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { ...toUpdate },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );

  const delSuccess = await deleteFromCloudinary(user.avatar);
  if (!delSuccess) {
    throw new ApiError(500, "Something went wrong while updating avatar");
  }

  const avatar = await uploadOnCloudinary(
    avatarLocalPath,
    CLOUD_AVATAR_FOLDER_NAME
  );

  if (!avatar.url) {
    throw new ApiError(
      500,
      "Error while uploading on avatar file in cloudinary"
    );
  }

  user.avatar = avatar.url;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Avatar file missing");
  }

  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );

  const delSuccess = await deleteFromCloudinary(user.coverImage);
  if (!delSuccess) {
    throw new ApiError(500, "Something went wrong while updating avatar");
  }

  const coverImage = await uploadOnCloudinary(
    coverImageLocalPath,
    CLOUD_COVERIMAGE_FOLDER_NAME
  );

  if (!coverImage.url) {
    throw new ApiError(
      400,
      "Error while uploading on avatar file in cloudinary"
    );
  }

  user.coverImage = coverImage.url;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { userName } = req.params;

  if (!userName?.trim()) {
    throw new ApiError(400, "userName is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        userName: userName?.toLocaleLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelSubscribedCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        userName: 1,
        subscribersCount: 1,
        channelSubscribedCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (channel?.length === 0) {
    throw new ApiError(404, "Channel does not exist");
  }

  res
    .status(200)
    .json(new ApiResponse(200, channel[0], "Channel fetched successfully"));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    userName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
      )
    );
});

export {
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
};
