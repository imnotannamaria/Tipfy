export const listAllIndicationsQuery = `{
  indications {
    id
    link
    name
    track
  }
}`

export const createIndicationMutation = `
mutation MyMutation($data: IndicationCreateInput!) {
  createIndication(data: $data) {
    id
    link
    name
    track
  }
}
`
export const setIndicationToPublishMutation = `
        mutation PublishIndication($id: ID!) {
          publishIndication(where: { id: $id }) {
            id
            link
            name
            publishedAt
          }
        }
      `
