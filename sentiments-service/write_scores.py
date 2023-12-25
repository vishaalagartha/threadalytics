from boto3 import resource, session
from botocore.config import Config
from boto3.dynamodb.conditions import Key
from decimal import Decimal
import csv
import os

sess = session.Session() if os.getenv('ENV') == 'PROD' else session.Session(profile_name='threadalytics')
config = Config(retries={ 'max_attempts': 20, 'mode': 'adaptive' })
dynamo_client = sess.resource(service_name='dynamodb', region_name='us-west-1', config=config)
scores_table = dynamo_client.Table('sentiment_scores')

def updateScores(items):
  for item in items:
     res = scores_table.query(KeyConditionExpression=Key('name').eq(item['name']))
     for old_item in res['Items']:
      scores_table.delete_item(Key=old_item)
     scores_table.put_item(Item=item)

items = []
with open('scores.csv', 'r') as csvfile:
    reader = csv.DictReader(csvfile, delimiter=',')
    for row in reader:
      items.append({
        'name': row['name'], 
        'score': Decimal(row['score'])
      })
updateScores(items)