import praw
from praw.models import MoreComments
from nltk import pos_tag, word_tokenize
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import csv, os
from dotenv import load_dotenv

load_dotenv()

reddit = praw.Reddit(client_id=os.getenv('PRAW_CLIENT_ID'),
        client_secret=os.getenv('PRAW_CLIENT_SECRET'),
        user_agent='Comment Extraction (by /u/vagartha)',
        password=os.getenv('PRAW_USERNAME'),
        username=os.getenv('PRAW_PASSWORD'))
reddit.read_only = True
submissions = reddit.subreddit("nba").hot(limit=100)

with open('names.txt', 'r') as f:
    names = f.read().split(',')
    name_to_full_name = {}
    for name in names:
        for el in name.split(' '):
            name_to_full_name[el] = name

d = []
for submission in submissions:
    submission.comment_sort = 'best'
    submission.comment_limit = 100
    d.append(('title', str(submission.title)))
    for top_level_comment in submission.comments:
        if isinstance(top_level_comment, MoreComments):
            continue
        d.append(('comment', str(top_level_comment.body)))

sentiments = {}
sid = SentimentIntensityAnalyzer()
for el in d:
    tags = pos_tag(word_tokenize(el[1]))
    for t in tags:
        if (t[1] == 'NNP' or t[1] == 'NNPS') and t[0] in name_to_full_name:
            name = name_to_full_name[t[0]]
            if name not in sentiments:
                sentiments[name] = { 'score': 0, 'pos_sentences': [], 'neg_sentences': [] } 
            score = sid.polarity_scores(el[1])['compound']
            sentiments[name]['score'] += score
            if score > 0:
                print(name, 'pos', el[1])
                sentiments[name]['pos_sentences'].append(el[1])
            elif score < 0:
                print(name, 'neg', el[1])
                sentiments[name]['neg_sentences'].append(el[1])

with open('sentiments.csv', 'w', newline='') as csvfile:
    fieldnames = ['name', 'pos_sentences', 'neg_sentences']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames, delimiter='|')

    writer.writeheader()
    for name in sentiments:
        row = {'name': name, 'pos_sentences': ';'.join(sentiments[name]['pos_sentences']), 
               'neg_sentences': ';'.join(sentiments[name]['neg_sentences'])}
        writer.writerow(row)