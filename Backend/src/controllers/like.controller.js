import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { Types, isValidObjectId } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Check if Invalid videoId
  if (!videoId.trim() || !isValidObjectId(videoId)) {
    throw new ApiError(400, "videoId is not valid!!!");
  }

  // Check if the video exists
  const video = await Video.findById(videoId);
  if (!video || !video.isPublished) {
    throw new ApiError(404, "Video not found!");
  }

  // Toggle like
  const userAlreadyLiked = await Like.findOne({
    video: videoId,
    owner: req.user?._id,
  });

  let like;

  if (userAlreadyLiked) {
    await Like.deleteOne({ video: videoId });
  } else {
    like = await Like.create({
      video: videoId,
      owner: req.user._id,
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Video ${like ? "liked" : "unliked"} successfully`
      )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId.trim() || !isValidObjectId(commentId)) {
    throw new ApiError(400, "commentID is not valid!!!");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "comment is not available!!!");
  }

  const commentLike = await Like.findOne({ comment: commentId });

  let like;

  if (commentLike) {
    await Like.deleteOne({ comment: commentId });
  } else {
    like = await Like.create({
      comment: commentId,
      owner: req.user._id,
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Comment ${like ? "liked" : "unliked"} successfully`
      )
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId.trim() || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "tweetID is not valid!!!");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "tweet is not available!!!");
  }

  const tweetLike = await Like.findOne({ tweet: tweetId });

  let like;

  if (tweetLike) {
    await Like.deleteOne({ tweet: tweetId });
  } else {
    like = await Like.create({
      tweet: tweetId,
      owner: req.user._id,
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Tweet ${like ? "liked" : "unliked"} successfully`
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likes = await Like.aggregate([
    {
      $match: {
        owner: new Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideos",
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
                    username: 1,
                    fullName: 1,
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

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likedVideos: likes[0]?.likedVideos || {} },
        "Liked Videos fetched successfully"
      )
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
