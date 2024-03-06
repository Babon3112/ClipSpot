import { User } from "../models/user.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Subscription } from "../models/subscription.model.js";

// toggle subscription by channel id
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // check if Invalid channelId
  if (!channelId.trim() || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  // check if channel not available
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not find!");
  }

  // prevent subscribe to own channel
  if (channelId.toString() === req.user._id) {
    throw new ApiError(400, "You cannot subscribe your own channel!");
  }

  // toggle the subscription
  const subscription = await Subscription.findOne({ channel: channelId });

  let subscribe;

  if (subscription?.subscriber?.toString() === req.user._id) {
    // un-subscribe
    await Subscription.findOneAndDelete({
      subscriber: req.user._id,
      channel: channelId,
    });
  } else {
    // subscribe
    subscribe = await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `${subscribe ? "Subscribed" : "unSubscribed"} successfully`
      )
    );
});

// get subscriber list of a channel
const getSubscribedChannels = asyncHandler(async (req, res) => {
  //id of user whose subscribed channel list is to be found
  //don't know why to do that we can simply get logged in user subscribed channels by using req.user._id
  const { userId } = req.params;
  if (!userId?.trim() || !isValidObjectId(userId)) {
    throw new ApiError(400, "userId is required");
  }
  const channels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(userId.trim()),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
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
      $addFields: {
        channel: {
          $first: "$channel",
        },
      },
    },
    {
      $project: {
        channel: 1,
        _id: 0,
      },
    },
    {
      $replaceRoot: {
        newRoot: "$channel",
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(200, channels, "Get subscribed channel list success")
    );
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  //id of user(channel) whose subscribers list is to be found
  //don't know why to do that we can simply get logged in user(channel) subscribers list by using req.user._id
  const { channelId } = req.params;
  if (!channelId?.trim() || !isValidObjectId(channelId)) {
    throw new ApiError(400, "channelId is required");
  }
  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId.trim()),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscribersList",
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
      $addFields: {
        subscribersList: {
          $first: "$subscribersList",
        },
      },
    },
    {
      $project: {
        subscribersList: 1,
        _id: 0,
      },
    },
    {
      $replaceRoot: {
        newRoot: "$subscribersList",
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Get channel subscribers list success")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
