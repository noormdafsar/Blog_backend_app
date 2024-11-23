const Post = require('../models/postModel');
const ErrorHandler = require('../utils/errorHandler');

// Create a new post
exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
      return next(new ErrorHandler('Title and content are required', 400));
    }

    const post = await Post.create({
      title,
      content,
      authorId: req.user._id // Set author from authenticated user
    });
    console.log('user created post', post);
    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
};

// Get all posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('authorId', 'name email');
    console.log('All posts', posts);
    res.status(200).json({
      success: true,
      posts
    });
  } catch (error) {
    next(error);
  }
};

// Get posts by a specific author
exports.getPostsByAuthor = async (req, res, next) => {
    try {
      const { authorId } = req.query; // Changed from 'author' to 'authorId' to match frontend
  
      if (!authorId) {
        return next(new ErrorHandler('Author ID is required', 400));
      }
  
      const posts = await Post.find({ authorId }).populate('authorId', 'name email');
      console.log('Posts by author', posts);
      
      if (!posts.length) {
        return next(new ErrorHandler('No posts found for this author', 404));
      }
  
      res.status(200).json({
        success: true,
        posts
      });
    } catch (error) {
      next(error);
    }
  };

// Edit a post
exports.updatePost = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
  
      // Validate input
      if (!title || !content) {
        return next(new ErrorHandler('Title and content are required', 400));
      }
  
      // Find and update the post
      let post = await Post.findById(id);
      console.log('post to update', post);
  
      if (!post) {
        return next(new ErrorHandler('Post not found', 404));
      }
  
      // Ensure only the author can edit their post
      if (post.authorId.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler('You are not authorized to update this post', 403));
      }
  
      post.title = title;
      post.content = content;
      post = await post.save();
      console.log('updated post', post);
  
      res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        post
      });
    } catch (error) {
      next(error);
    }
  };
  
  // Delete a post
  exports.deletePost = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // Find the post to delete
      const post = await Post.findById(id);
      console.log('post to delete', post);
  
      if (!post) {
        return next(new ErrorHandler('Post not found', 404));
      }
  
      // Ensure only the author can delete their post
      if (post.authorId.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler('You are not authorized to delete this post', 403));
      }
  
      await post.deleteOne();
      console.log('post deleted');
  
      res.status(200).json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
  
