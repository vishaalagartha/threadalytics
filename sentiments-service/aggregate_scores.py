from nltk.sentiment.vader import SentimentIntensityAnalyzer
from boto3 import resource, session
from botocore.config import Config
from decimal import Decimal
from boto3.dynamodb.conditions import Key
from time import time
import csv
import collections

sess = session.Session(profile_name='threadalytics')
config = Config(retries={ 'max_attempts': 20, 'mode': 'adaptive' })
dynamo_client = sess.resource(service_name='dynamodb', region_name='us-west-1', config=config)
name_table = dynamo_client.Table('sentiment_scores')
sentence_table = dynamo_client.Table('sentiment_sentences')
sid = SentimentIntensityAnalyzer()

# 1 day in seconds
delta = 24*60*60
now = int(time())
start = now - delta
def get_sentences():
  done = False
  start_key = None
  scan_kwargs = {
    "FilterExpression": Key("timestamp").between(
        str(start), str(now)
    )
  }
  items = []
  while not done:
    if start_key:
      scan_kwargs["ExclusiveStartKey"] = start_key
    response = sentence_table.scan(**scan_kwargs)
    items.extend(response.get('Items', []))
    start_key = response.get("LastEvaluatedKey", None)
    done = start_key is None
  return items

response = get_sentences()
scores = collections.defaultdict(int)
for item in response:
  name = item['name']
  pos_sentences = item['pos_sentences'].split(';')
  neg_sentences = item['neg_sentences'].split(';')
  score = 0
  for s in pos_sentences:
    score += sid.polarity_scores(s)['pos']
  for s in neg_sentences:
    score -= sid.polarity_scores(s)['neg']
  scores[name] += score

with open('scores.csv', 'w', newline='') as csvfile:
    fieldnames = ['name', 'score']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames, delimiter=',')

    writer.writeheader()
    for name, score in scores.items():
        row = {'name': name, 'score': score}
        writer.writerow(row)