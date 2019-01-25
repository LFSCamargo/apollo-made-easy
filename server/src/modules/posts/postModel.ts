import * as mongoose from 'mongoose';

export interface Post extends mongoose.Document {
  title: string;
  description: string;
  user: string;
  active: boolean,
  postLikes: string[],
}

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  postLikes: {
    type: [String],
    required: false,
    default: [],
  },
  user: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  collection: 'posts',
});

export default mongoose.model<Post>('Post', Schema);