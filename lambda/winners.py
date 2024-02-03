import praw
from praw.models import MoreComments
import csv, os, collections
from dotenv import load_dotenv
import boto3
from datetime import datetime
load_dotenv()

teams = ['atlanta hawks',
 'boston celtics',
 'cleveland cavaliers',
 'chicago bulls',
 'dallas mavericks',
 'denver nuggets',
 'golden state warriors',
 'houston rockets',
 'los angeles clippers',
 'los angeles lakers',
 'miami heat',
 'milwaukee bucks',
 'minnesota timberwolves',
 'brooklyn nets',
 'new york knicks',
 'orlando magic',
 'indiana pacers',
 'philadelphia 76ers',
 'phoenix suns',
 'portland trail blazers',
 'sacramento kings',
 'san antonio spurs',
 'oklahoma city thunder',
 'toronto raptors',
 'utah jazz',
 'memphis grizzlies',
 'washington wizards',
 'detroit pistons',
 'charlotte hornets',
 'new orleans pelicans']

def lambda_handler(event, context):
    reddit = praw.Reddit(client_id=os.getenv('PRAW_CLIENT_ID'),
      client_secret=os.getenv('PRAW_CLIENT_SECRET'),
      user_agent='Comment Extraction (by /u/vagartha)',
      password=os.getenv('PRAW_USERNAME'),
      username=os.getenv('PRAW_PASSWORD'))
    reddit.read_only = True
    submissions = reddit.subreddit('nba').top(time_filter='day')
    name_to_full_name = collections.defaultdict(list)
    with open('names.txt', 'r') as f:
        names = f.read().split(',')
        for name in names:
            for el in name.split(' '):
                if el == 'Jr.' or el == 'Sr.' or el in ['I', 'II', 'III', 'IV', 'V']: continue
                name_to_full_name[el].append(name)
    with open('english.txt', 'r') as f:
        words = [w.strip('\n') for w in f.readlines()]
        stopwords = set(words)
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
    
    counts = collections.defaultdict(int)
    for label, sentence in d:
        words = sentence.lower().split()
        for w in words:
            if w in name_to_full_name and w not in stopwords:
                for n in name_to_full_name[w]:
                    counts[n] += 1
    
    top = sorted([(v, k) for k, v in counts.items()], reverse=True)
    team = None
    player = None
    for i, n in top:
        if n in teams:
            team = n
        else:
            player = n
        if player is not None and team is not None:
            break
    time = datetime.now()
    time_string = f'{time:%Y-%m-%d}'
    line = f'{time_string},{player.title()},{team.title()}\r\n'
    sess = boto3.session.Session(
        aws_access_key_id=os.getenv('ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('SECRET_KEY'),
    )
    s3 = sess.client('s3')
    file = s3.get_object(Bucket='threadalytics-data', Key='winners_of_day.csv')
    data = file['Body'].read()
    data += bytes(line, 'utf-8')
    s3.put_object(Body=data, Bucket='threadalytics-data', Key='winners_of_day.csv')
    return {
        'statusCode': 200,
        'body': 'success'
    }
