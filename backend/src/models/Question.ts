import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  title: string;
  body: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  votes: Array<{
    user: mongoose.Types.ObjectId;
    type: 'upvote' | 'downvote';
    createdAt: Date;
  }>;
  views: number;
  status: 'open' | 'closed' | 'duplicate';
  acceptedAnswer?: mongoose.Types.ObjectId;
  duplicateOf?: mongoose.Types.ObjectId;
  closedReason?: string;
  closedBy?: mongoose.Types.ObjectId;
  closedAt?: Date;
  isPinned: boolean;
  isFeatured: boolean;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
  getVoteScore(): number;
}

const questionSchema = new Schema<IQuestion>({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  body: {
    type: String,
    required: [true, 'Please add question content'],
    minlength: [30, 'Question body must be at least 30 characters'],
    maxlength: [30000, 'Question body cannot exceed 30000 characters'],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [{
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  }],
  votes: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['upvote', 'downvote'],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  views: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'duplicate'],
    default: 'open',
  },
  acceptedAnswer: {
    type: Schema.Types.ObjectId,
    ref: 'Answer',
  },
  duplicateOf: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
  },
  closedReason: {
    type: String,
  },
  closedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  closedAt: {
    type: Date,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Calculate vote score
questionSchema.methods.getVoteScore = function(): number {
  return this.votes.reduce((score: number, vote: any) => {
    return vote.type === 'upvote' ? score + 1 : score - 1;
  }, 0);
};

// Update lastActivity when question is modified
questionSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

// Indexes for better performance
questionSchema.index({ author: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ lastActivity: -1 });
questionSchema.index({ status: 1 });
questionSchema.index({ title: 'text', body: 'text' });

export const Question = mongoose.model<IQuestion>('Question', questionSchema);
