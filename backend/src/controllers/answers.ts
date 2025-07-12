import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Answer } from '../models/Answer';
import { Question } from '../models/Question';
import { User } from '../models/User';

// @desc    Get answers for a question
// @route   GET /api/answers/question/:questionId
// @access  Public
export const getAnswers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate('author', 'username avatar reputation badges')
      .sort({ isAccepted: -1, createdAt: 1 });

    const answersWithScores = answers.map(answer => {
      const voteScore = answer.votes.reduce((score: number, vote: any) => {
        return vote.type === 'upvote' ? score + 1 : score - 1;
      }, 0);

      return {
        ...answer.toObject(),
        voteScore,
      };
    });

    res.status(200).json({
      success: true,
      count: answersWithScores.length,
      data: answersWithScores,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new answer
// @route   POST /api/answers
// @access  Private
export const createAnswer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { body, questionId } = req.body;

    if (!body || !questionId) {
      res.status(400).json({
        success: false,
        error: 'Please provide answer body and question ID',
      });
      return;
    }

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404).json({
        success: false,
        error: 'Question not found',
      });
      return;
    }

    const answer = await Answer.create({
      body,
      question: questionId,
      author: req.user?.id,
    });

    // Update question's lastActivity
    await Question.findByIdAndUpdate(questionId, { lastActivity: new Date() });

    // Update user stats
    await User.findByIdAndUpdate(req.user?.id, {
      $inc: { 'stats.answersGiven': 1 },
    });

    const populatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'username avatar reputation badges');

    res.status(201).json({
      success: true,
      data: populatedAnswer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update answer
// @route   PUT /api/answers/:id
// @access  Private
export const updateAnswer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let answer = await Answer.findById(req.params.id);

    if (!answer) {
      res.status(404).json({
        success: false,
        error: 'Answer not found',
      });
      return;
    }

    // Make sure user is answer owner or admin
    if (answer.author.toString() !== req.user?.id && req.user?.role !== 'admin') {
      res.status(401).json({
        success: false,
        error: 'Not authorized to update this answer',
      });
      return;
    }

    answer = await Answer.findByIdAndUpdate(
      req.params.id,
      { body: req.body.body },
      { new: true, runValidators: true }
    ).populate('author', 'username avatar reputation badges');

    res.status(200).json({
      success: true,
      data: answer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete answer
// @route   DELETE /api/answers/:id
// @access  Private
export const deleteAnswer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      res.status(404).json({
        success: false,
        error: 'Answer not found',
      });
      return;
    }

    // Make sure user is answer owner or admin
    if (answer.author.toString() !== req.user?.id && req.user?.role !== 'admin') {
      res.status(401).json({
        success: false,
        error: 'Not authorized to delete this answer',
      });
      return;
    }

    await Answer.findByIdAndDelete(req.params.id);

    // Update user stats
    await User.findByIdAndUpdate(answer.author, {
      $inc: { 'stats.answersGiven': -1 },
    });

    res.status(200).json({
      success: true,
      data: 'Answer deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vote on answer
// @route   POST /api/answers/:id/vote
// @access  Private
export const voteAnswer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type } = req.body;

    if (!type || !['upvote', 'downvote'].includes(type)) {
      res.status(400).json({
        success: false,
        error: 'Please provide a valid vote type (upvote or downvote)',
      });
      return;
    }

    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      res.status(404).json({
        success: false,
        error: 'Answer not found',
      });
      return;
    }

    // Check if user already voted
    const existingVoteIndex = answer.votes.findIndex(
      vote => vote.user.toString() === req.user?.id
    );

    if (existingVoteIndex !== -1) {
      // Remove existing vote
      answer.votes.splice(existingVoteIndex, 1);
    }

    // Add new vote if it's different from the removed one
    const existingVoteType = existingVoteIndex !== -1 ? answer.votes[existingVoteIndex]?.type : null;
    
    if (existingVoteType !== type) {
      answer.votes.push({
        user: req.user?.id,
        type: type as 'upvote' | 'downvote',
        createdAt: new Date(),
      });
    }

    await answer.save();

    const voteScore = answer.votes.reduce((score: number, vote: any) => {
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

// @desc    Accept answer
// @route   POST /api/answers/:id/accept
// @access  Private
export const acceptAnswer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      res.status(404).json({
        success: false,
        error: 'Answer not found',
      });
      return;
    }

    const question = await Question.findById(answer.question);

    if (!question) {
      res.status(404).json({
        success: false,
        error: 'Question not found',
      });
      return;
    }

    // Only question author can accept answers
    if (question.author.toString() !== req.user?.id) {
      res.status(401).json({
        success: false,
        error: 'Only the question author can accept answers',
      });
      return;
    }

    // Unaccept previous accepted answer if exists
    if (question.acceptedAnswer) {
      await Answer.findByIdAndUpdate(question.acceptedAnswer, {
        isAccepted: false,
        $unset: { acceptedAt: 1, acceptedBy: 1 },
      });
    }

    // Accept this answer
    answer.isAccepted = true;
    answer.acceptedAt = new Date();
    answer.acceptedBy = req.user?.id;
    await answer.save();

    // Update question
    question.acceptedAnswer = answer._id as any;
    await question.save();

    // Update answer author stats
    await User.findByIdAndUpdate(answer.author, {
      $inc: { 'stats.acceptedAnswers': 1 },
    });

    res.status(200).json({
      success: true,
      data: 'Answer accepted successfully',
    });
  } catch (error) {
    next(error);
  }
};
