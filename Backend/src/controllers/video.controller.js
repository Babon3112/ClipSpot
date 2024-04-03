import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { Comment } from "../models/comment.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.util.js";
import {
  CLOUD_THUMBNAIL_FOLDER_NAME,
  CLOUD_VIDEO_FOLDER_NAME,
} from "../constants.js";

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "All fields are required!!!");
  }

  const videoFileLocalPath = req.files.videoFile[0].path;
  if (!videoFileLocalPath) {
    throw new ApiError(400, "Video is missing!");
  }

  const thumbnailLocalPath = req.files.thumbnail[0].path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail is missing!");
  }

  const uploadedVideo = await uploadOnCloudinary(
    videoFileLocalPath,
    CLOUD_VIDEO_FOLDER_NAME
  );
  const uploadedThumbnail = await uploadOnCloudinary(
    thumbnailLocalPath,
    CLOUD_THUMBNAIL_FOLDER_NAME
  );

  if (!uploadedVideo || !uploadedThumbnail) {
    throw new ApiError(500, "Something went wrong while uploading video");
  }

  const video = await Video.create({
    videoFile: uploadedVideo.url,
    thumbnail: uploadedThumbnail.url,
    title: title.trim(),
    description: description.trim(),
    duration: Math.round(uploadedVideo.duration),
    owner: req.user._id,
  });

  if (!video) {
    await deleteFromCloudinary(uploadedVideo.url);
    await deleteFromCloudinary(uploadedThumbnail.url);
    throw new ApiError(500, "Something went wrong!!!");
  }
  res
    .status(201)
    .json(new ApiResponse(201, video, "video uploaded successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId?.trim() || !isValidObjectId(videoId)) {
    throw new ApiError(400, "videoId is not valid!!!");
  }

  let video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found!!!");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You don't have permission to update this video!");
  }

  const { title, description } = req.body;

  let toUpdate = {};

  if (title?.trim()) {
    toUpdate["title"] = title;
  }

  if (description?.trim()) {
    toUpdate["description"] = description;
  }

  const thumbnailLocalPath = req.file?.path;
  if (thumbnailLocalPath) {
    const thumbnail = await uploadOnCloudinary(
      thumbnailLocalPath,
      CLOUD_THUMBNAIL_FOLDER_NAME
    );
    if (!thumbnail) {
      throw new ApiError(
        500,
        "Something went wrong while updating thumbnail!!"
      );
    }
    await deleteFromCloudinary(video.thumbnail);
    toUpdate["thumbnail"] = thumbnail.url;
  }

  video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: { ...toUpdate },
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId?.trim() || !isValidObjectId(videoId)) {
    throw new ApiError(400, "videoId is not valid!!!");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found!!!");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You don't have permission to delete this video!");
  }

  if (video.owner?._id?.toString() !== req.user?._id?.toString()) {
    throw new ApiError(401, "You cannot delete this video");
  }

  const { _id, videoFile, thumbnail } = video;
  const delResponse = await Video.findByIdAndDelete(_id);
  if (delResponse) {
    await Promise.all([
      Like.deleteMany({ video: _id }),
      Comment.deleteMany({ video: _id }),
      deleteFromCloudinary(videoFile, "video"),
      deleteFromCloudinary(thumbnail),
    ]);
  } else {
    throw new ApiError(500, "Something went wrong while deleting video");
  }

  res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = `/^video/`,
    sortBy = "createdAt",
    sortType = 1,
    userId = req.user._id,
  } = req.query;

  // find user in db
  const user = await User.findById({
    _id: userId,
  });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const getAllVideosAggregate = await Video.aggregate([
    {
      $match: {
        videoOwner: new mongoose.Types.ObjectId(userId),
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      },
    },
    {
      $sort: {
        [sortBy]: sortType,
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  Video.aggregatePaginate(getAllVideosAggregate, { page, limit })
    .then((result) => {
      return res
        .status(200)
        .json(
          new ApiResponse(200, result, "fetched all videos successfully !!")
        );
    })
    .catch((error) => {
      console.log("getting error while fetching all videos:", error);
      throw error;
    });
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "videoId is required or invalid!!");
  }

  let video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
        likes: {
          $size: "$likes",
        },
        views: {
          $add: [1, "$views"],
        },
      },
    },
  ]);

  if (video.length > 0) {
    video = video[0];
  }

  await Video.findByIdAndUpdate(videoId, {
    $set: {
      views: video.views,
    },
  });

  res.status(200).json(new ApiResponse(200, video, "Get single video success"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // check if Invalid videoId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId!");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found!");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Toggle public status set successfully"));
});

export {
  updateVideo,
  deleteVideo,
  getVideoById,
  getAllVideos,
  publishAVideo,
  togglePublishStatus,
};
