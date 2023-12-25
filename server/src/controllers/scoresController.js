import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const client = new DynamoDBClient({ region: 'us-west-1' })
const docClient = DynamoDBDocumentClient.from(client)

const getScores = async () => {
  try {
    const command = new ScanCommand({
      TableName: 'sentiment_scores'
    })
    const response = await docClient.send(command)
    return response.Items.map(item => unmarshall(item))
  } catch(error) {
    console.error(error)
  }
}

export { getScores }
