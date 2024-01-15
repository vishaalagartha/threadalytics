# Threadalytics


## Overview
Threadalytics is a sentiment analysis tool aiming to capture the most recent sentiments from the NBA subreddit. As a frequenter of the subreddit, I thought it would be a useful tool to generate a quick snapshot of the subreddit's top sentiments over the course of the day and display it visually for users to see.

In summary, the goals of this project were to
* Objectively calculate sentiment of all NBA teams and players over last day
* Display top player sentiment scores and update every hour
* Display sentiment scores in a graphical representation (i.e. bar chart)
* Show some sentences that contributed to the score
* Reduce Performance/Latency - users should not have to wait a long time to see results
* Usability - graphical representation should be aesthetic and intuitive to understand

Based on these goals, I used this tech stack:
* ReactJS (frontend framework)
* D3JS (data visualization)
* NodeJS (backend framework)
* Python (scraping and sentiment analysis)
* AWS S3 (static website hosting)
* AWS EC2 (server hosting)
* DynamoDB (database)
* Route53 + Cloudfront (CDN, domain hosting, and SSL certificate management)

## Architecture
The project maintains a simple client-server architecture with a DynamoDB database. The server has a simple API that allows users to obtain the top scores for each hour and the sentences that contribute to each sentiment.

In order to reduce server load, I use another EC2 instance separate from my API server that uses a Python Reddit API client known as PRAW and Natural Language Toolkit (NLTK) for scraping and performing sentiment analysis. The reason for this decision was the computation complexity that this process entails. This service runs on a CRON job once an hour.

The project is available at [https://threadalytics.com](https://threadalytics.com). A deeper explanation of the implementation details is available on my [about page](https://threadalytics.com/about). A clear architectural diagram is also available in this [FigJam file](https://www.figma.com/file/Z1puaOabg8GjFQlxAKSos0/Threadalytics-System-Design?type=whiteboard&node-id=0%3A1&t=WKmPR9yLw7fZu7sh-1).