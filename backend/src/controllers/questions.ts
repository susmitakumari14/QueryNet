import { Request, Response, NextFunction } from 'express';
import { Question } from '../models/Question';
import { User } from '../models/User';
import { Answer } from '../models/Answer';

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
export const getQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = req.query.sort as string || '-createdAt';
    const search = req.query.search as string;

    let query: any = { status: 'open' };

    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const questions = await Question.find(query)
      .populate('author', 'username avatar reputation')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Add vote scores and answer counts
    const questionsWithDetails = await Promise.all(
      questions.map(async (question: any) => {
        const voteScore = question.votes.reduce((score: number, vote: any) => {
          return vote.type === 'upvote' ? score + 1 : score - 1;
        }, 0);

        const answerCount = await Answer.countDocuments({ question: question._id });

        return {
          ...question,
          voteScore,
          answerCount,
          hasAcceptedAnswer: !!question.acceptedAnswer,
        };
      })
    );

    const total = await Question.countDocuments(query);

    res.status(200).json({
      success: true,
      count: questionsWithDetails.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: questionsWithDetails,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
export const getQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username avatar reputation badges')
      .populate('acceptedAnswer');

    if (!question) {
      res.status(404).json({
        success: false,
        error: 'Question not found',
      });
      return;
    }

    // Increment view count
    await Question.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // Get answers for this question
    const answers = await Answer.find({ question: req.params.id })
      .populate('author', 'username avatar reputation badges')
      .sort({ isAccepted: -1, createdAt: 1 });

    // Add vote scores to answers
    const answersWithScores = answers.map(answer => {
      const voteScore = answer.votes.reduce((score: number, vote: any) => {
        return vote.type === 'upvote' ? score + 1 : score - 1;
      }, 0);

      return {
        ...answer.toObject(),
        voteScore,
      };
    });

    // Add vote score to question
    const voteScore = question.votes.reduce((score: number, vote: any) => {
      return vote.type === 'upvote' ? score + 1 : score - 1;
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        question: {
          ...question.toObject(),
          voteScore,
        },
        answers: answersWithScores,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new question
// @route   POST /api/questions
// @access  Private
export const createQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, body, tags } = req.body;

    if (!title || !body || !tags || tags.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Please provide title, body, and at least one tag',
      });
      return;
    }

    const question = await Question.create({
      title,
      body,
      tags,
      author: req.user.id,
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.questionsAsked': 1 },
    });

    const populatedQuestion = await Question.findById(question._id)
      .populate('author', 'username avatar reputation');

    res.status(201).json({
      success: true,
      data: populatedQuestion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private
export const updateQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404).json({
        success: false,
        error: 'Question not found',
      });
      return;
    }

    // Make sure user is question owner or admin
    if (question.author.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(401).json({
        success: false,
        error: 'Not authorized to update this question',
      });
      return;
    }

    const { title, body, tags } = req.body;
    const updateFields: any = {};

    if (title) updateFields.title = title;
    if (body) updateFields.body = body;
    if (tags) updateFields.tags = tags;

    question = await Question.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    }).populate('author', 'username avatar reputation');

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private
export const deleteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404).json({
        success: false,
        error: 'Question not found',
      });
      return;
    }

    // Make sure user is question owner or admin
    if (question.author.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(401).json({
        success: false,
        error: 'Not authorized to delete this question',
      });
      return;
    }

    await Question.findByIdAndDelete(req.params.id);

    // Delete all answers for this question
    await Answer.deleteMany({ question: req.params.id });

    // Update user stats
    await User.findByIdAndUpdate(question.author, {
      $inc: { 'stats.questionsAsked': -1 },
    });

    res.status(200).json({
      success: true,
      data: 'Question deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vote on question
// @route   POST /api/questions/:id/vote
// @access  Private
export const voteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type } = req.body; // 'upvote' or 'downvote'

    if (!type || !['upvote', 'downvote'].includes(type)) {
      res.status(400).json({
        success: false,
        error: 'Please provide a valid vote type (upvote or downvote)',
      });
      return;
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404).json({
        success: false,
        error: 'Question not found',
      });
      return;
    }

    // Check if user already voted
    const existingVoteIndex = question.votes.findIndex(
      vote => vote.user.toString() === req.user.id
    );

    if (existingVoteIndex !== -1) {
      // Remove existing vote
      question.votes.splice(existingVoteIndex, 1);
    }

    // Add new vote if it's different from the removed one
    const existingVoteType = existingVoteIndex !== -1 ? question.votes[existingVoteIndex]?.type : null;
    
    if (existingVoteType !== type) {
      question.votes.push({
        user: req.user.id,
        type: type as 'upvote' | 'downvote',
        createdAt: new Date(),
      });
    }

    await question.save();

    const voteScore = question.votes.reduce((score: number, vote: any) => {
      return vote.type === 'upvote' ? score + 1 : score - 1;
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        voteScore,
        userVote: existingVoteType !== type ? type : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get questions by tag
// @route   GET /api/questions/tag/:tag
// @access  Public
export const getQuestionsByTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tag = req.params.tag;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const questions = await Question.find({ tags: tag, status: 'open' })
      .populate('author', 'username avatar reputation')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Question.countDocuments({ tags: tag, status: 'open' });

    res.status(200).json({
      success: true,
      count: questions.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get questions by user
// @route   GET /api/questions/user/:userId
// @access  Public
export const getQuestionsByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const questions = await Question.find({ author: userId })
      .populate('author', 'username avatar reputation')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Question.countDocuments({ author: userId });

    res.status(200).json({
      success: true,
      count: questions.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};
