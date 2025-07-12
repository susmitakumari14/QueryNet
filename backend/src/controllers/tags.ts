import { Request, Response, NextFunction } from 'express';

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
