import praw
from praw.models import MoreComments
import csv, os
from dotenv import load_dotenv
import boto3
from datetime import datetime
load_dotenv()

def lambda_handler():
    reddit = praw.Reddit(client_id=os.getenv('PRAW_CLIENT_ID'),
          client_secret=os.getenv('PRAW_CLIENT_SECRET'),
          user_agent='Comment Extraction (by /u/vagartha)',
          password=os.getenv('PRAW_USERNAME'),
          username=os.getenv('PRAW_PASSWORD'))
    reddit.read_only = True
    submissions = reddit.subreddit('nba').top(time_filter='day')
    comments = []
    i = 0
    for s in submissions:
        if i > 100:
            break
        s.comment_sort = 'best'
        s.comment_limit = 1
        for c in s.comments:
            if isinstance(c, MoreComments) or c.author == 'AutoModerator':
                continue
            comments.append({ 'score': c.score, 'body': c.body, 'author': c.author, 'link': c.permalink })
        i += 1
    comments.sort(key=lambda x: -x['score'])
    top_5 = comments[:5]
    time = datetime.now()
    time_string = f'{time:%Y-%m-%d}'
    line = f'{time_string},'
    for el in top_5:
        body = el['body'].replace('\n', ' ')
        line += f'{el["score"]}|{el["author"]}|{body}|{el["link"]}|'
    line = line[:-1]
    line += '\r\n'
    sess = boto3.session.Session(
        aws_access_key_id=os.getenv('ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('SECRET_KEY'),
    )
    s3 = sess.client('s3')
    file = s3.get_object(Bucket='threadalytics-data', Key='top_comments.csv')
    data = file['Body'].read()
    data += bytes(line, 'utf-8')
    s3.put_object(Body=data, Bucket='threadalytics-data', Key='top_comments.csv')
    return {
        'statusCode': 200,
        'body': 'success'
    }
lambda_handler()