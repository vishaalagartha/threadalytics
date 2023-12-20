from boto3 import resource, session
from botocore.config import Config
from decimal import Decimal
import csv

sess = session.Session(profile_name='threadalytics')
config = Config(retries={ 'max_attempts': 20, 'mode': 'adaptive' })
dynamo_client = sess.resource(service_name='dynamodb', region_name='us-west-1', config=config)
scores_table = dynamo_client.Table('sentiment_scores')

def updateScores(items):
  for item in items:
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