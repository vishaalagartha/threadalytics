import { DynamoDBClient, QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb'
import Attr from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const client = new DynamoDBClient({ region: 'us-west-1' })
const docClient = DynamoDBDocumentClient.from(client)

const getSentences = async (name) => {
  try {
    const command = new QueryCommand({
      TableName: 'sentiment_sentences',
      KeyConditionExpression: "#name = :nameValue",
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ":nameValue": { S: name },
      }
    })
    const response = await docClient.send(command)
    return response.Items.map(item => unmarshall(item))
  } catch(error) {
    console.error(error)
    return []
  }
}

export { getSentences }