const express = require('express');
const router = express.Router();
const { improvePrompt } = require('../services/aiService');
const { protect } = require('../middleware/authMiddleware');

// Controller for improving prompt
const handleImprovePrompt = async (req, res, next) => {
  try {
    const { prompt, category, aiModel } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide prompt text to improve'
      });
    }

    const result = await improvePrompt({
      prompt: prompt.trim(),
      category: category || 'Development',
      aiModel: aiModel || 'ChatGPT'
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Protected AI endpoint for registered users
router.post('/improve', protect, handleImprovePrompt);

// Public AI demo endpoint for landing page interactive widget
router.post('/demo', handleImprovePrompt);

module.exports = router;
