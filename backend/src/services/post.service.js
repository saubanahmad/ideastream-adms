/**
 * src/services/post.service.js — Post Business Logic
 * Uses MongoDB Post model.
 */
const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');

const checkMongoConfig = () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI missing");
  }
};

const createPost = async ({ authorId, authorUsername, title, content, feed, imageUrl }) => {
  checkMongoConfig();
  const post = new Post({
    authorId,
    authorUsername,
    title,
    content,
    feed,
    imageUrl,
  });
  await post.save();
  return post;
};

const getPosts = async (query = {}) => {
  checkMongoConfig();
  
  const filter = {};
  if (query.feed) filter.feed = query.feed;
  if (query.authorUsername) filter.authorUsername = query.authorUsername;
  if (query.authorId) filter.authorId = query.authorId;

  let sortOption = { createdAt: -1 }; // default is latest
  if (query.sort === 'trending') {
    sortOption = { score: -1, createdAt: -1 };
  }

  const posts = await Post.find(filter).sort(sortOption);
  return posts;
};

const getPostById = async (postId) => {
  checkMongoConfig();
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
};

const updatePost = async (postId, userId, { title, content }) => {
  checkMongoConfig();
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  
  if (post.authorId !== userId) {
    throw new Error("Unauthorized: You can only edit your own posts");
  }

  if (title) post.title = title;
  if (content) post.content = content;

  await post.save();
  return post;
};

const deletePost = async (postId, userId) => {
  checkMongoConfig();
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  if (post.authorId !== userId) {
    throw new Error("Unauthorized: You can only delete your own posts");
  }

  await Post.deleteOne({ _id: postId });

  // If the post has an image, delete the physical file
  if (post.imageUrl) {
    try {
      const filePath = path.join(__dirname, '../../', post.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error("Failed to delete post image file:", err);
    }
  }
  return true;
};

const searchPosts = async (keyword) => {
  checkMongoConfig();
  if (!keyword || !keyword.trim()) return [];
  
  const regex = new RegExp(keyword, 'i');
  const filter = {
    $or: [
      { title: regex },
      { content: regex },
      { authorUsername: regex },
      { feed: regex }
    ]
  };

  return await Post.find(filter).sort({ createdAt: -1 }).limit(10);
};

const updateAuthorUsername = async (authorId, newUsername) => {
  checkMongoConfig();
  
  // Update posts where the user is the main author
  await Post.updateMany(
    { authorId },
    { $set: { authorUsername: newUsername } }
  );

  // Update embedded comments where the user commented
  await Post.updateMany(
    { "comments.authorId": authorId },
    { $set: { "comments.$[elem].authorUsername": newUsername } },
    { arrayFilters: [{ "elem.authorId": authorId }] }
  );
  
  return true;
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost, searchPosts, updateAuthorUsername };
