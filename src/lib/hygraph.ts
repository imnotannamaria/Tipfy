import { GraphQLClient } from 'graphql-request'

export const hygraph = new GraphQLClient(
  process.env.NEXT_PUBLIC_HYGRAPH_API || '',
)
