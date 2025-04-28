import mongoose from 'mongoose';

const showcaseItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  component: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const ShowcaseItem = mongoose.models.ShowcaseItem || mongoose.model('ShowcaseItem', showcaseItemSchema);