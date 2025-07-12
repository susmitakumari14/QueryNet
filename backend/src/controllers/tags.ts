import { Request, Response, NextFunction } from 'express';
import { Question } from '../models/Question';

export const getTags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      data: 'Tags endpoint - coming soon',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular tags with question counts
// @route   GET /api/tags/popular
// @access  Public
export const getPopularTags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    // Aggregate tags from all questions
    const tagCounts = await Question.aggregate([
      { $match: { status: 'open' } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $project: {
          tag: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: tagCounts,
    });
  } catch (error) {
    next(error);
  }
};
