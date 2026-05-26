/**
 * src/services/post.service.js — Post Business Logic
 * Uses MongoDB Post model.
 */
const Post = require('../models/Post');

const checkMongoConfig = () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI missing");
  }
};

const createPost = async ({ authorId, authorUsername, title, content, feed }) => {
  checkMongoConfig();
  const post = new Post({
    authorId,
    authorUsername,
    title,
    content,
    feed,
  });
  await post.save();
  return post;
};

const getPosts = async (query = {}) => {
  checkMongoConfig();
  // Filter by feed if provided, otherwise return all
  const filter = query.feed ? { feed: query.feed } : {};
  // Sort by createdAt descending (newest first)
  const posts = await Post.find(filter).sort({ createdAt: -1 });
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
  return true;
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
