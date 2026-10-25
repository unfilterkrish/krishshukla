const { Prompt, CATEGORIES, AI_MODELS } = require('../models/Prompt');

// Helper to normalize tags
const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim().replace(/^#/, '')).filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);
  }
  return [];
};

// @desc    Get all prompts for logged-in user with search, filter, and sort
// @route   GET /api/prompts
// @access  Private
const getPrompts = async (req, res, next) => {
  try {
    const { search, category, aiModel, isFavorite, tag, sort } = req.query;

    // Base query scoped to the authenticated user
    const query = { user: req.user._id };

    // Search by title, content, description, or tags
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    // Category filter
    if (category && category !== 'All' && category.trim() !== '') {
      query.category = category.trim();
    }

    // AI Model filter
    if (aiModel && aiModel !== 'All' && aiModel.trim() !== '') {
      query.aiModel = aiModel.trim();
    }

    // Favorite filter
    if (isFavorite !== undefined && isFavorite !== '') {
      query.isFavorite = isFavorite === 'true' || isFavorite === true;
    }

    // Specific tag filter
    if (tag && tag.trim() !== '') {
      query.tags = tag.trim().replace(/^#/, '');
    }

    // Sort order
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'title-asc') {
      sortOptions = { title: 1 };
    } else if (sort === 'title-desc') {
      sortOptions = { title: -1 };
    } else if (sort === 'updated') {
      sortOptions = { updatedAt: -1 };
    }

    const prompts = await Prompt.find(query).sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: prompts.length,
      prompts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for user
// @route   GET /api/prompts/stats
// @access  Private
const getPromptStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Total Prompts
    const totalPrompts = await Prompt.countDocuments({ user: userId });

    // Favorite Prompts
    const favoritesCount = await Prompt.countDocuments({
      user: userId,
      isFavorite: true
    });

    // Distinct Categories
    const categoriesUsed = await Prompt.distinct('category', { user: userId });
    const categoriesCount = categoriesUsed.length;

    // Recently Added (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyAddedCount = await Prompt.countDocuments({
      user: userId,
      createdAt: { $gte: sevenDaysAgo }
    });

    // Breakdown by category
    const categoryBreakdown = await Prompt.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Breakdown by AI Model
    const modelBreakdown = await Prompt.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$aiModel', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalPrompts,
        favoritesCount,
        categoriesCount,
        recentlyAddedCount,
        categoryBreakdown,
        modelBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single prompt by ID
// @route   GET /api/prompts/:id
// @access  Private
const getPromptById = async (req, res, next) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt not found'
      });
    }

    // Verify ownership
    if (prompt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this prompt'
      });
    }

    return res.status(200).json({
      success: true,
      prompt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new prompt
// @route   POST /api/prompts
// @access  Private
const createPrompt = async (req, res, next) => {
  try {
    const { title, content, description, category, tags, aiModel, isFavorite } =
      req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a prompt title'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide prompt content'
      });
    }

    // Validate category if provided
    const validCategory =
      category && CATEGORIES.includes(category) ? category : 'Development';

    // Validate AI Model if provided
    const validModel =
      aiModel && AI_MODELS.includes(aiModel) ? aiModel : 'ChatGPT';

    const prompt = await Prompt.create({
      user: req.user._id,
      title: title.trim(),
      content: content.trim(),
      description: (description || '').trim(),
      category: validCategory,
      tags: parseTags(tags),
      aiModel: validModel,
      isFavorite: Boolean(isFavorite)
    });

    return res.status(201).json({
      success: true,
      message: 'Prompt created successfully',
      prompt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update prompt by ID
// @route   PUT /api/prompts/:id
// @access  Private
const updatePrompt = async (req, res, next) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt not found'
      });
    }

    // Verify ownership
    if (prompt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this prompt'
      });
    }

    const { title, content, description, category, tags, aiModel, isFavorite } =
      req.body;

    if (title !== undefined) prompt.title = title.trim();
    if (content !== undefined) prompt.content = content.trim();
    if (description !== undefined) prompt.description = description.trim();
    if (category !== undefined && CATEGORIES.includes(category)) {
      prompt.category = category;
    }
    if (tags !== undefined) {
      prompt.tags = parseTags(tags);
    }
    if (aiModel !== undefined && AI_MODELS.includes(aiModel)) {
      prompt.aiModel = aiModel;
    }
    if (isFavorite !== undefined) {
      prompt.isFavorite = Boolean(isFavorite);
    }

    const updatedPrompt = await prompt.save();

    return res.status(200).json({
      success: true,
      message: 'Prompt updated successfully',
      prompt: updatedPrompt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete prompt by ID
// @route   DELETE /api/prompts/:id
// @access  Private
const deletePrompt = async (req, res, next) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt not found'
      });
    }

    // Verify ownership
    if (prompt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this prompt'
      });
    }

    await prompt.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Prompt deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite status of prompt
// @route   PATCH /api/prompts/:id/favorite
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt not found'
      });
    }

    // Verify ownership
    if (prompt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this prompt'
      });
    }

    prompt.isFavorite = !prompt.isFavorite;
    await prompt.save();

    return res.status(200).json({
      success: true,
      message: prompt.isFavorite
        ? 'Prompt added to favorites'
        : 'Prompt removed from favorites',
      isFavorite: prompt.isFavorite,
      prompt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed sample prompts for quick exploration if library is empty
// @route   POST /api/prompts/seed
// @access  Private
const seedSamplePrompts = async (req, res, next) => {
  try {
    const count = await Prompt.countDocuments({ user: req.user._id });
    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Prompts already exist in your vault'
      });
    }

    const starterPrompts = [
      {
        user: req.user._id,
        title: 'Cinematic Product Photography',
        description:
          'Generates ultra-realistic, studio-lit commercial product photographs with shallow depth of field and dramatic obsidian lighting.',
        content:
          'Create a cinematic product photograph with dramatic studio lighting, {105mm f/1.4} lens depth of field, subtle rim glow, hyper-detailed texture on dark obsidian background. Subject: {luxury watch / perfume bottle}. Style: Commercial advertising, 8k resolution, photorealistic octanerender.',
        category: 'Image Generation',
        tags: ['cinematic', 'product', 'photography', 'commercial', 'studio'],
        aiModel: 'Midjourney',
        isFavorite: true
      },
      {
        user: req.user._id,
        title: 'Code Refactoring & Unit Tests',
        description:
          'Transforms legacy functions into clean, typed, modular code complete with Vitest / Jest unit tests and edge cases.',
        content:
          'Refactor the provided TypeScript React hook for state management. Ensure:\n1. Adherence to Clean Architecture and DRY principles\n2. Robust error boundary handling\n3. Zero memory leaks in useEffect\n4. Provide 4 comprehensive Vitest test cases covering happy path and edge cases.\n\nCode to refactor:\n{code_snippet}',
        category: 'Development',
        tags: ['TypeScript', 'React', 'Vitest', 'Refactoring', 'Testing'],
        aiModel: 'Claude',
        isFavorite: true
      },
      {
        user: req.user._id,
        title: 'High-Converting SaaS Landing Copy',
        description:
          'Crafts persuasive, clear Hero and feature headlines based on direct response copywriting frameworks.',
        content:
          'Adopt the persona of an elite direct-response SaaS copywriter. Write a high-converting hero section for a product called {Product_Name}. Include:\n- Punchy primary headline focusing on core benefit\n- Clarifying sub-headline removing friction\n- Primary CTA button text\n- Social proof badge\n- 3 bullet points with objection handling',
        category: 'Marketing',
        tags: ['Copywriting', 'SaaS', 'Conversion', 'Marketing'],
        aiModel: 'ChatGPT',
        isFavorite: false
      },
      {
        user: req.user._id,
        title: 'Executive Meeting Summary & Action Tracker',
        description:
          'Distills lengthy meeting transcripts into key strategic decisions, blockers, and assigned action items.',
        content:
          'Analyze the following raw meeting transcript. Extract:\n1. Executive Summary (max 3 sentences)\n2. Key Decisions Agreed Upon\n3. Critical Blockers & Risks\n4. Action Item Matrix: [Owner | Task | Priority | Due Date]\n\nTranscript:\n{transcript_text}',
        category: 'Productivity',
        tags: ['Executive', 'Meetings', 'Summary', 'Productivity'],
        aiModel: 'Gemini',
        isFavorite: true
      },
      {
        user: req.user._id,
        title: 'Interactive Socratic Tutor for Complex Topics',
        description:
          'Teaches technical concepts interactively using the Socratic method instead of dumping paragraphs.',
        content:
          'You are a patient, world-class Socratic mentor. Your goal is to guide me in understanding {Topic: e.g. Quantum Computing / Backpropagation} step by step. Do not explain everything at once. Ask me one thought-provoking foundational question at a time, evaluate my response, and guide me toward arriving at the answer myself.',
        category: 'Education',
        tags: ['Socratic', 'Learning', 'Tutor', 'Education'],
        aiModel: 'ChatGPT',
        isFavorite: false
      }
    ];

    const inserted = await Prompt.insertMany(starterPrompts);

    return res.status(201).json({
      success: true,
      message: 'Sample prompts created successfully',
      count: inserted.length,
      prompts: inserted
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPrompts,
  getPromptStats,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
  toggleFavorite,
  seedSamplePrompts
};
