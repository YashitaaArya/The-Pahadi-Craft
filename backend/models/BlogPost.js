const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // used in the URL: /blog/:slug
  excerpt: { type: String, default: '' },
  content: { type: String, required: true }, // stored as HTML-ish paragraphs, rendered on the post page
  image: { type: String, default: '' },
  author: { type: String, default: '' },
  category: { type: String, default: '' },
  tags: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  views: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] }, // Firebase uids of customers who liked this post
}, { timestamps: true });

blogPostSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.likes = (ret.likedBy || []).length;
    delete ret._id;
    delete ret.__v;
    delete ret.likedBy; // count is public, the list of who liked it isn't
    return ret;
  }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);