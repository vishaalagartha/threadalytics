import praw
from praw.models import MoreComments
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import csv, os, collections
from dotenv import load_dotenv
import boto3
from datetime import datetime

load_dotenv()
def run():
  sid = SentimentIntensityAnalyzer()
  name_to_full_name = collections.defaultdict(list)
  with open('names.txt', 'r') as f:
      names = f.read().split(',')
      for name in names:
          for el in name.split(' '):
              if el == 'Jr.' or el == 'Sr.' or el in ['I', 'II', 'III', 'IV', 'V']: continue
              name_to_full_name[el].append(name)

  reddit = praw.Reddit(client_id=os.getenv('PRAW_CLIENT_ID'),
          client_secret=os.getenv('PRAW_CLIENT_SECRET'),
          user_agent='Comment Extraction (by /u/vagartha)',
          password=os.getenv('PRAW_USERNAME'),
          username=os.getenv('PRAW_PASSWORD'))
  reddit.read_only = True
  submissions = reddit.subreddit('nba')

  submissions = reddit.subreddit('nba').top(time_filter='day')

  d = []
  i = 0
  for submission in submissions:
      i += 1
      submission.comment_sort = 'best'
      submission.comment_limit = 1000
      d.append(('title', str(submission.title)))
      for top_level_comment in submission.comments:
          if isinstance(top_level_comment, MoreComments):
              continue
          d.append(('comment', str(top_level_comment.body)))

  counts = collections.defaultdict(set)
  for label, sentence in d:
      words = sentence.split()
      for w in words:
          if w in name_to_full_name:
              for n in name_to_full_name[w]:
                  counts[n].add(sentence)

  top = sorted([(v, k) for k, v in counts.items()], reverse=True, key=lambda x: len(x[0]))
  covered = set()
  names = []
  for k, v in top:
      if len(names) > 10:
          break
      n = set(v.split(' '))
      # Name has already been covered
      if n.intersection(covered):
          continue
      names.append(v)
      covered.update(n)

  top = [(s, k) for s, k in top if k in names]

  data = []
  for s, name in top:
      score = 0
      pos, neg = [], []
      for ss in s:
          scores = sid.polarity_scores(ss)
          if scores['pos'] > scores['neg'] + 0.3:
              pos.append(ss)
          elif scores['neg'] > scores['pos'] + 0.3:
              neg.append(ss)
          score += scores['compound']
      if len(pos) > len(neg) + 3:
          data.append({'name': name, 'score': score, 'sentences': '\n'.join(pos) })
      elif len(neg) > len(pos) + 3:
          data.append({'name': name, 'score': score, 'sentences': '\n'.join(pos) })

  with open('data.csv', 'w+', newline='') as csvfile:
      fieldnames = ['name', 'sentences', 'score']
      writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
      writer.writeheader()
      for v in data:
          writer.writerow(v)
  sess = boto3.session.Session(
    aws_access_key_id=os.getenv('ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('SECRET_KEY'),
  )
  s3 = sess.client('s3')
  time = datetime.now()
  filename = f'{time:%Y-%M-%D-%H}.csv'
  with open('data.csv', 'rb') as f:
      s3.upload_fileobj(f, 'threadalytics-data', filename)
run()