import { Request, Response, NextFunction } from 'express';
import { Question } from '../models/Question';
import { User } from '../models/User';

// Get community stats
export const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get total questions
    const totalQuestions = await Question.countDocuments();
    
    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get questions today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const questionsToday = await Question.countDocuments({
      createdAt: { $gte: today }
    });
    
    // Get answered percentage
    const questionsWithAnswers = await Question.countDocuments({
      'answers.0': { $exists: true }
    });
    const answeredPercentage = totalQuestions > 0 
      ? Math.round((questionsWithAnswers / totalQuestions) * 100)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalQuestions,
        totalUsers,
        questionsToday,
        answeredPercentage
      }
    });
  } catch (error) {
    next(error);
  }
};
