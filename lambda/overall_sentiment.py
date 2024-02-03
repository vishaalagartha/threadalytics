import praw
from praw.models import MoreComments
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import csv, os, collections
from dotenv import load_dotenv
import boto3
from datetime import datetime

load_dotenv()

reddit = praw.Reddit(client_id=os.getenv('PRAW_CLIENT_ID'),
      client_secret=os.getenv('PRAW_CLIENT_SECRET'),
      user_agent='Comment Extraction (by /u/vagartha)',
      password=os.getenv('PRAW_USERNAME'),
      username=os.getenv('PRAW_PASSWORD'))
reddit.read_only = True
submissions = reddit.subreddit('nba')



def run():
  submissions = reddit.subreddit('nba').top(time_filter='hour')
  sid = SentimentIntensityAnalyzer()
  score = 0
  pos, neg = 0, 0
  for s in submissions:
      scores = sid.polarity_scores(s.title)
      if scores['pos'] > scores['neg']:
          pos += 1
      elif scores['neg'] > scores['pos']:
          neg += 1
      score += scores['compound']
  time = datetime.now()
  time_string = f'{time:%Y-%m-%d-%H}'
  s = f'{time_string},{pos},{neg},{score}\r\n'
  sess = boto3.session.Session(
  aws_access_key_id=os.getenv('ACCESS_KEY_ID'),
  aws_secret_access_key=os.getenv('SECRET_KEY'),
  )
  s3 = sess.client('s3')
  file = s3.get_object(Bucket='threadalytics-data', Key='overall_sentiments.csv')
  data = file['Body'].read()
  data += bytes(s, 'utf-8')
s3.put_object(Body=data, Bucket='threadalytics-data', Key='overall_sentiments.csv')