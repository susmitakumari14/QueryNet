import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer extends Document {
  body: string;
  author: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  votes: Array<{
    user: mongoose.Types.ObjectId;
    type: 'upvote' | 'downvote';
    createdAt: Date;
  }>;
  isAccepted: boolean;
  acceptedAt?: Date;
  acceptedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  getVoteScore(): number;
}

const answerSchema = new Schema<IAnswer>({
  body: {
    type: String,
    required: [true, 'Please add answer content'],
    minlength: [30, 'Answer must be at least 30 characters'],
    maxlength: [30000, 'Answer cannot exceed 30000 characters'],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
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
  isAccepted: {
    type: Boolean,
    default: false,
  },
  acceptedAt: {
    type: Date,
  },
  acceptedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Calculate vote score
answerSchema.methods.getVoteScore = function(): number {
  return this.votes.reduce((score: number, vote: any) => {
    return vote.type === 'upvote' ? score + 1 : score - 1;
  }, 0);
};

// Indexes for better performance
answerSchema.index({ author: 1 });
answerSchema.index({ question: 1 });
answerSchema.index({ createdAt: -1 });
answerSchema.index({ isAccepted: 1 });

export const Answer = mongoose.model<IAnswer>('Answer', answerSchema);
