import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: 'answer' | 'comment' | 'question' | 'badge' | 'mention' | 'vote' | 'accept';
  title: string;
  message: string;
  isRead: boolean;
  data?: {
    questionId?: string;
    answerId?: string;
    userId?: string;
    badgeId?: string;
    url?: string;
  };
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  readAt?: Date;
}

const notificationSchema = new Schema<INotification>({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['answer', 'comment', 'question', 'badge', 'mention', 'vote', 'accept'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  message: {
    type: String,
    required: true,
    maxlength: [500, 'Message cannot exceed 500 characters'],
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  data: {
    questionId: {
      type: String,
      sparse: true,
    },
    answerId: {
      type: String,
      sparse: true,
    },
    userId: {
      type: String,
      sparse: true,
    },
    badgeId: {
      type: String,
      sparse: true,
    },
    url: {
      type: String,
      maxlength: [500, 'URL cannot exceed 500 characters'],
    },
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
  },
  readAt: {
    type: Date,
    sparse: true,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

// Set readAt when isRead changes to true
notificationSchema.pre('save', function(next) {
  if (this.isModified('isRead') && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
