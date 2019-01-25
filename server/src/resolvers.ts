import userResolvers from './modules/user/userResolvers';
import postResolvers from './modules/posts/postResolvers';
import { GraphQLContext } from './graphqlTypes';
import { User } from './modules/user/userModel';
import { Post } from './modules/posts/postModel';
import { withFilter } from 'apollo-server';

export const SUBSCRIPTION_TRIGGERS = {
	POST_ADDED: 'POST_ADDED',
	NOTIFICATION_ADDED: 'NOTIFICATION_ADDED',
}

interface NotificationPayload {
	user: User;
	post: Post;
	text: string;
}

interface NotificationArgs {
	yourUser: String;
}

export default {
	Subscription: {
		postAdded: {
			resolve: (obj) => obj,
			subscribe: (root, args, { pubsub }: GraphQLContext) => pubsub.asyncIterator([SUBSCRIPTION_TRIGGERS.POST_ADDED]),
		},
		notificationArrived: {
			resolve: (obj) => obj,
			subscribe: withFilter(
				(root, args, { pubsub }: GraphQLContext) => pubsub.asyncIterator(SUBSCRIPTION_TRIGGERS.NOTIFICATION_ADDED),
				(obj: NotificationPayload, args: NotificationArgs) => obj.post.user.toString() === args.yourUser,
			)
		}
  },
	Post: postResolvers.Post,
	Query: {
		...userResolvers.Query,
		...postResolvers.Query
	},
	Mutation: {
		...userResolvers.Mutation,
		...postResolvers.Mutation
	},
};
