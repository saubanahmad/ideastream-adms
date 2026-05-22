/**
 * src/services/post.service.js — Post Business Logic
 * Uses MongoDB Post model.
 * Implementation: Phase 3
 */

// TODO Phase 3: Implement post service
// const Post = require('../models/Post');

const createPost = async ({ authorId, authorUsername, title, content, feed }) => {
  throw new Error("Not implemented yet");
};

const getPostById = async (postId) => {
  throw new Error("Not implemented yet");
};

const updatePost = async (postId, userId, { title, content }) => {
  throw new Error("Not implemented yet");
};

const deletePost = async (postId, userId) => {
  throw new Error("Not implemented yet");
};

module.exports = { createPost, getPostById, updatePost, deletePost };
