from boto3 import resource, session
from botocore.config import Config
from decimal import Decimal
from boto3.dynamodb.conditions import Key
from time import time
import csv

sess = session.Session(profile_name='threadalytics')
config = Config(retries={ 'max_attempts': 20, 'mode': 'adaptive' })
dynamo_client = sess.resource(service_name='dynamodb', region_name='us-west-1', config=config)

def writeSentencesBatch(items):
  for i in range(0, len(items), 25):
    sub_items = items[i:i+25]
    dynamo_client.batch_write_item(
      RequestItems={
      'sentiment_sentences': sub_items
      }
    )

items = []
# Delete items after 3 days
#exp_delta = 60*60*24*3
exp_delta = 60*60
timestamp = int(time())
with open('sentiments.csv', 'r') as csvfile:
    reader = csv.DictReader(csvfile, delimiter='|')
    for row in reader:
      if not row['pos_sentences'] and not row['neg_sentences']:
        continue
      items.append({
        'PutRequest': {
          'Item': {
            'name': row['name'], 
            'pos_sentences': row['pos_sentences'],
            'neg_sentences': row['neg_sentences'],
            'timestamp': str(timestamp),
            'exp_date': timestamp + exp_delta
          }
        }
      })
writeSentencesBatch(items)