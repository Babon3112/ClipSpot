import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createTweet = asyncHandler(async (req, res) => {
  const content = req.body?.content?.trim();
  if (!content) {
    throw new ApiError("content is required");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  if (!tweet) {
    throw new ApiError(500, "tweet is not created");
  }

  res
    .status(200)
    .json(new ApiResponse(201, tweet, "tweet created successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId?.trim() || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "tweetId is not valid!!!");
  }

  const tweet = await Tweet.findById(tweetId);

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You don't have permission to update this tweet!");
  }

  const content = req.body?.content?.trim();
  if (!content) {
    throw new ApiError("content is required");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );
  if (!updatedTweet) {
    throw new ApiError("Error while updating comment");
  }

  res
    .status(201)
    .json(new ApiResponse(200, updateTweet, "Comment updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId?.trim() || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "tweetId is not valid!!!");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet is not available!!!");
  }

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You don't have permission to delete this tweet!");
  }

  const delTweet = await Tweet.findByIdAndDelete(tweet._id);
  if (!delTweet) {
    throw new ApiError(500, "Error while deleting teet");
  }

  res.status(200).json(new ApiResponse(201, {}, "Tweet deleted successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId?.trim() || !isValidObjectId(userId)) {
    throw new ApiError(400, "userId is not valid!!!");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User is not available!!!");
  }

  const tweets = await Tweet.find({
    owner: userId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
