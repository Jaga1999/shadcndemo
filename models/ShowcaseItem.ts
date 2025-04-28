import mongoose from 'mongoose';

const showcaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'draft',
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

showcaseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const ShowcaseItem = mongoose.models.ShowcaseItem || mongoose.model('ShowcaseItem', showcaseSchema);