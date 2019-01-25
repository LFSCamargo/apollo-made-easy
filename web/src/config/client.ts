import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-client-preset'
import { getMainDefinition } from 'apollo-utilities'

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:5000/graphql',
  options: {
    reconnect: true,
  },
})

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/',
})

const authLink = setContext(async (_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: localStorage.getItem('token'),
    },
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation }: any = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
})

export default client