const express = require('express');
const router = express.Router();
const {
  getPrompts,
  getPromptStats,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
  toggleFavorite,
  seedSamplePrompts
} = require('../controllers/promptController');
const { protect } = require('../middleware/authMiddleware');

// All prompt routes require authentication
router.use(protect);

// Pre-id specific sub-routes
router.get('/stats', getPromptStats);
router.post('/seed', seedSamplePrompts);

// Base prompt CRUD routes
router.route('/')
  .get(getPrompts)
  .post(createPrompt);

router.route('/:id')
  .get(getPromptById)
  .put(updatePrompt)
  .delete(deletePrompt);

router.patch('/:id/favorite', toggleFavorite);

module.exports = router;
