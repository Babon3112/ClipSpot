import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";
import { Types, isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const addCommentToVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId?.trim() || !isValidObjectId(videoId)) {
    throw new ApiError("videoID is not valid!!!");
  }

  const content = req.body?.content?.trim();
  if (!content) {
    throw new ApiError("content is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video is not available!!!");
  }

  const comment = await Comment.create({
    content,
    video: video._id,
    owner: req.user._id,
  });

  if (!comment) {
    throw new ApiError(500, "Comment is not created");
  }

  res
    .status(200)
    .json(new ApiResponse(201, comment, "comment created successfully"));
});

const addCommentToTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId?.trim() || !isValidObjectId(tweetId)) {
    throw new ApiError("videoID is not valid!!!");
  }

  const content = req.body?.content?.trim();
  if (!content) {
    throw new ApiError("content is required");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Video is not available!!!");
  }

  const comment = await Comment.create({
    content,
    tweet: tweet._id,
    owner: req.user._id,
  });

  if (!comment) {
    throw new ApiError(500, "Comment is not created");
  }

  res
    .status(200)
    .json(new ApiResponse(201, comment, "comment created successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId?.trim() || !isValidObjectId(commentId)) {
    throw new ApiError(400, "commentID is not valid!!!");
  }

  const comment = await Comment.findById(commentId);

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You don't have permission to update this comment!"
    );
  }

  const content = req.body?.content?.trim();
  if (!content) {
    throw new ApiError("content is required");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );
  if (!updatedComment) {
    throw new ApiError("Error while updating comment");
  }

  res
    .status(201)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId?.trim() || !isValidObjectId(commentId)) {
    throw new ApiError(400, "commentID is not valid!!!");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "comment is not available!!!");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You don't have permission to delete this comment!"
    );
  }

  const delComment = await Comment.findByIdAndDelete(comment._id);
  if (!delComment) {
    throw new ApiError(500, "Error while deleting comment");
  }

  res
    .status(200)
    .json(new ApiResponse(201, {}, "Comment deleted successfully"));
});

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // check if Invalid videoId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId!");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "comment is not available!!!");
  }

  const aggregate = Comment.aggregate([
    {
      $match: {
        video: new Types.ObjectId(videoId),
      },
    },
  ]);

  Comment.aggregatePaginate(aggregate, { page, limit })
    .then(function (result) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, { result }, "Video Comment fetched successfully")
        );
    })
    .catch(function (error) {
      throw error;
    });
});

const getTweetComments = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // check if Invalid videoId
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid videoId!");
  }
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "tweet is not available!!!");
  }

  const aggregate = Comment.aggregate([
    {
      $match: {
        tweet: new Types.ObjectId(tweetId),
      },
    },
  ]);

  Comment.aggregatePaginate(aggregate, { page, limit })
    .then(function (result) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, { result }, "Tweet Comment fetched successfully")
        );
    })
    .catch(function (error) {
      throw error;
    });
});

export {
  deleteComment,
  updateComment,
  getVideoComments,
  getTweetComments,
  addCommentToVideo,
  addCommentToTweet,
};
