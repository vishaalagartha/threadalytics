import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import Attr from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const getSentences = async (name, type) => {
  try {
    const command = new ScanCommand({
      TableName: 'sentiment_sentences',
      FilterExpression: 'player_timestamp begins_with(:player_timestamp)',
      ExpressionAttributeValues: {
        ":player_timestamp": { S: "Stephen_Curry" },
      },
    })
    const response = await docClient.send(command)
    return response.Items.map(item => unmarshall(item))
  } catch(error) {
    console.error(error)
  }
}

export { getSentences }