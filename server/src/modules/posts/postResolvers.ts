import { GraphQLContext } from '../../graphqlTypes';
import postModel, { Post } from './postModel';
import * as R from 'ramda';
import { SUBSCRIPTION_TRIGGERS } from '../../resolvers';
import userResolvers from '../user/userResolvers';
import userModel from '../user/userModel';

interface ArgsAdd {
  title: string;
  description: string;
}

interface FindOne {
  _id: string;
}

interface ConnectionArgs {
	first: number;
	after: number;
	search: string;
}

export default {
  Post: {
    likesCount: async (root: Post) => {
      const post = await postModel.findOne({
        _id: root._id,
      });

      const { postLikes } = post;

      return postLikes.length;
    },
    user: async (root: Post, args, context) => await userModel.findOne({ _id: root.user }),
    liked: async (root: Post, args, { user }: GraphQLContext) => R.includes(user._id, root.postLikes),
  },
  Mutation: {
    addPost: async (root, { title, description }: ArgsAdd, { user, pubsub }: GraphQLContext): Promise<Post> => {
      if (!user) {
        throw new Error('Please login to add posts');
      }
      const post = new postModel({
        title,
        description,
        user: user._id
      });

      await post.save();

      pubsub.publish(SUBSCRIPTION_TRIGGERS.POST_ADDED, {
        post: await postModel.findOne({
          _id: post._id,
        }),
      })

      return await postModel.findOne({
        _id: post._id
      });
    },
    deletePost: async (root, { _id }: FindOne, { user }: GraphQLContext): Promise<{
      message: string;
    }> => {
      if (!user) {
        throw new Error('Please login to delete a post');
      }

      const post = postModel.findOne({
        _id
      });

      if (!post) {
        throw new Error('This post does not exists');
      }

      await post.update({
        active: false,
      });

      return {
        message: 'Post Deleted with Success',
      }
    },
    likePost: async (root, { _id }: FindOne, { user, pubsub }: GraphQLContext) => {
      if (!user) {
        throw new Error('Please login to like a post');
      }

      const post = await postModel.findOne({
        _id,
      });

      if (!post) {
        throw new Error('This post does not exists');
      }

      const { postLikes } = post;

      if (!R.includes(user._id, postLikes)) {
        await post.update({
          postLikes: [
            ...postLikes,
            user._id,
          ]
        })

        pubsub.publish(SUBSCRIPTION_TRIGGERS.NOTIFICATION_ADDED, {
          user,
          post: await postModel.findOne({
            _id
          }),
          text: `${user.name} liked your post`,
        })
      } else {
        const unlike = postLikes.filter((element) => element !== user._id);
        await post.update({
          postLikes: unlike
        })
      }

      return await postModel.findOne({
        _id,
      })
    },
  },
  Query: {
    post: async (root, { _id }: FindOne, { user }: GraphQLContext) => await postModel.findOne({
      _id
    }),
    posts: async (root, { first, after, search }: ConnectionArgs, { user }: GraphQLContext) => {
      const limit = first ? first : 10;

			const args = search ? {
				name: {
					$regex: new RegExp(`^${search}`, 'ig'),
				},
				active: true
			} : { active: true };

			if (!after) {
				const edges = await postModel.find(args).limit(limit).sort({ createdAt: -1 });
        const count = await postModel.find(args).limit(limit).count();
        const hasNextPage = (Number(count) < first);

				return {
          hasNextPage,
					count,
					edges
				}
			}

			const edges = await postModel.find(args).limit(limit).skip(after).sort({ createdAt: -1 });
      const count = await postModel.find(args).limit(limit).skip(after).count();
      const hasNextPage = (Number(count) > first);
			return {
        hasNextPage,
				count,
				edges
			}
    }
  },
}