const mongoose = require('mongoose');

const CATEGORIES = [
  'Development',
  'Writing',
  'Marketing',
  'Image Generation',
  'Productivity',
  'Education',
  'Other'
];

const AI_MODELS = [
  'ChatGPT',
  'Gemini',
  'Claude',
  'Midjourney',
  'Other'
];

const promptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a prompt title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    content: {
      type: String,
      required: [true, 'Please provide the prompt content']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a valid category'
      },
      default: 'Other',
      index: true
    },
    tags: {
      type: [String],
      default: []
    },
    aiModel: {
      type: String,
      required: [true, 'Please select an AI model'],
      enum: {
        values: AI_MODELS,
        message: '{VALUE} is not a supported AI model'
      },
      default: 'ChatGPT',
      index: true
    },
    isFavorite: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for user-specific search and queries
promptSchema.index({ user: 1, createdAt: -1 });
promptSchema.index({ user: 1, isFavorite: 1 });
promptSchema.index({ user: 1, category: 1 });
promptSchema.index({ title: 'text', content: 'text', description: 'text' });

module.exports = {
  Prompt: mongoose.model('Prompt', promptSchema),
  CATEGORIES,
  AI_MODELS
};
