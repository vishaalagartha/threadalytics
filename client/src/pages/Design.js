import Header from '../components/Header'
import { Row, Col, Image } from 'react-bootstrap'
import Api from '../assets/api.png'
import Design_ from '../assets/design.png'
import TechStack from '../assets/tech_stack.png'
import AwsInfra from '../assets/aws_infra.png'


const Design = () => {

  return (
    <div>
      <Header />
      <Row className='mt-3 justify-center'>
        <Col xs={10} className='text-center'>
          <h1>
            So... how does this work?
          </h1>
        </Col>
      </Row>
      <Row className='ml-5'>
        The goal of this project was to capture the recent sentiments from r/nba about NBA players and teams.
        <br />
        After capturing relevant data, we want to display it in a visually appealing fashion and convey details about
        why a certain team or player got the score.
        <br />
        Based on this we can capture the following functional and non-functional requirements
      </Row>
      <Row className='ml-5 mt-3'>
        <Col xs={6}>
          <h3 className='text-center'>
            Functional Requirements
          </h3>
          <ul>
            <li>Objectively calculate sentiment of all NBA teams and players over last day</li>
            <li>Display overall subreddit sentiment</li>
              <ul>
                <li>Show ratio of positive to negative titles over course of day</li>
                <li>Show compound sentiment 'score' as a function of time</li>
              </ul>
            <li>Display the most mentioned players and teams</li>
              <ul>
                <li>With ability to toggle date</li>
              </ul>
            <li>Display top player sentiment scores and update every hour</li>
              <ul>
                <li>With ability to toggle date</li>
                <li>Show some sentences that contributed to the score</li>
              </ul>
          </ul>
        </Col>
        <Col xs={6}>
          <h3 className='text-center'>
            Non-Functional Requirements
          </h3>
          <ul>
            <li>Performance/Latency
              <ul><li>Users should not have to wait a long time to see results</li></ul>
            </li>
            <li>Usability
              <ul><li>Graphical representation should be aesthetic and intuitive to understand</li></ul>
            </li>
          </ul>
        </Col>
      </Row>
      <Row className='mt-3 ml-3'>
        <Col xs={{ span: 6, offset: 1 }}>
          Based on these requirements, we can justify the following tech stack:
          <ul>
            <li>ReactJS (frontend framework)</li>
            <li><a href='https://d3js.org/'>D3JS</a> (data visualization)</li>
            <li>NodeJS (backend framework)</li>
            <li>Python (scraping and sentiment analysis)</li>
            <li>AWS S3 (static website hosting)</li>
            <li>AWS EC2 (server hosting)</li>
            <li>AWS S3 (log/database)</li>
            <li>Route53 + Cloudfront (CDN, domain hosting, and SSL certificate management)</li>
          </ul>
          Let's dive a little deeper into some specifics
        </Col>
        <Col xs={3}>
            <Image src={TechStack} width={'100%'} />
          </Col>
      </Row>
      <Row>
        <Col xs={{ span: 10, offset: 1 }}>
          <p className='inline-block '>
            <br/>
            We can opt to use a microservice architecture in this situation to reduce the load across multiple servers. 
            Namely, we will have multiple services performing:
            <ul>
              <li>Scraping titles and comments and performing sentiment analysis on player, team, and coach names</li>
              <li>Scraping titles to understand the overall sentiment of the subreddit</li>
              <li>Finding the top comments of each day</li>
              <li>Logging the most frequently mentioned team and player of the day</li>
            </ul>
            <br />
            Of course, we will have a main API server that will handle all client HTTP requests.
            <br/>
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 4, offset: 1 }}>
          <Image src={AwsInfra} />
        </Col>
        <Col xs={{ span: 6 }}>
          <h3>AWS Infrastructure</h3>
          I opted to use AWS Lambda to handle the scraping and sentiment analysis logic.
          AWS Lambda is a serverless solution that allows users to call lambda 'functions' on a given trigger.
          These functions can be written in multiple languages such as NodeJS, Python, Java, etc. and can be further customized
          using containerization and lambda layers.
          <br />
          Since my application used PRAW, a Python API wrapper and NLTK's Python library, it was simple to use a Python3.8 runtime environment.
          However, I did need multiple packages to be installed prior to function execution, so I created a custom lambda layer. The lambda layer
          consisted of the following packages necessary to perform scraping, sentiment analysis, and writing to S3:
          <ul>
            <li>PRAW - for scraping</li>
            <li>NLTK - for sentiment analysis</li>
            <li>boto3 - for writing to S3 and other AWS interaction</li>
          </ul>
          <br />
          We can use AWS's Event Scheduler service to run each of these as a CRON job. 
          The Player and Overall Sentiment services will run on an hourly basis, while the Top Comments and Daily Winners services will run on a daily basis.
        </Col>
      </Row>
      <Row className='py-5'>
        <Col xs={{ span: 5, offset: 1}} className="border-r-2 border-b-2 p-3">
          <h4>Player sentiment analysis microservice</h4>
          <p>This module is responsible for obtaining sentiments toward all players over the past hour. The logic is as follows:</p>
          <ol>
            <li>1) Obtain top posts for 400 seconds</li>
            <ol>
              For each post, obtain all comments with a limit of 1000, sorted by most upvotes
            </ol>
            <li>2) Use a prewritten list of all NBA players, teams, and coaches to find sentences containing any entity</li>
            <ol>
              For each entity maintain a list of sentences that involve them using a hashmap
            </ol>
            <li>3) Sort the hashmap to find the most frequently mentioned entities</li>
            <li>4) For each entity in the top 10, compute a polarity score of each of its sentences</li>
            <ol>
              If the polarity score is excessively positive or negative, store it for future use.
              If the number of positive scores is much larger than the number of negative scores (or vice a versa) store the entity's scores and sentences
            </ol>
            <li>5) Write results to S3 log file</li>
          </ol>
          <p>This service runs on an hourly basis</p>
        </Col>
        <Col xs={{ span: 3, offset: 0}} className="border-b-2 p-3">
          <h4>Subreddit Sentiment Microservice</h4>
          <p>This module is responsible for obtaining overall sentiment of the subreddit The logic is as follows:</p>
          <ol>
            <li>1) Obtain all posts over last hour</li>
            <ol>
              For each post, compute the polarity score of the title and aggregate it
            </ol>
            <li>2) Write results to a S3 log file</li>
          </ol>
          <p>This service runs on an hourly basis</p>
        </Col>
        <Col xs={{ span: 5, offset: 1}} className="border-r-2 p-3">
          <h4>Top Comments Microservice</h4>
          <p>This module is responsible for obtaining overall sentiment of the subreddit The logic is as follows:</p>
          <ol>
            <li>1) Obtain the top posts of the day</li>
            <ol>
              For each post, get the most upvoted comment
            </ol>
            <li>2) Sort comments by upvotes</li>
            <li>3) Write results to a S3 log file</li>
          </ol>
          <p>This service runs on an hourly basis</p>
        </Col>
        <Col xs={{ span: 5, offset: 0}} className="p-3">
          <h4>Daily Winners Microservice</h4>
          <p>This module is responsible for obtaining overall sentiment of the subreddit The logic is as follows:</p>
          <ol>
            <li>1) Obtain the top posts of the day</li>
            <ol>
              For each post, get the top 1000 comments
            </ol>
            <li>2) Count the number of occurrences of each player and team</li>
            <li>3) Sort by most occurrences</li>
            <li>4) Obtain most mentioned player and most mentioned team</li>
            <li>5) Write results to a log file</li>
          </ol>
          <p>This service runs on an hourly basis</p>
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 4, offset: 1}}>
          <h3>Deployment architecture</h3>
          <p>
            S3 buckets will maintain our static website, which can be synced and easily deployed.
            The domain name threadalytics was purchased via NameCheap, 
            <a href='https://www.namecheap.com/support/knowledgebase/article.aspx/10371/2208/how-do-i-link-my-domain-to-amazon-web-services/'> but we can create a hosted zone </a>
            which will allow us to link our domain name to our S3 bucket by pointing the domain to the provided name servers.
            <br/>
            Additionally, AWS certificate manager will allow us to create certificates for all *.threadalytics.com endpoints.
            This will allow us to host our frontend on https://threadalytics.com and https://www.threadalytics.com.
            <br/>
            The subdomain https://api.threadalytics.com will host our API.
          </p>
        </Col>
        <Col xs={6}>
          <Image src={Design_}></Image>
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 4, offset: 1}}>
          <h4>
            API Design
          </h4>
          <p className='inline-block'>
            Endpoint: <a href='https://api.threadalytics.com'>https://api.threadalytics.com</a>
          </p>
          <p>
            We will need 4 endpoints for our server:
            <ul>
              <li><code>GET /sentiments</code></li>
              <li><code>GET /scores</code></li>
              <li><code>GET /comments</code></li>
              <li><code>GET /winners</code></li>
            </ul>
          </p>
          <p>Each endpoint will read from the appropriate log file stored on S3 and return the appropriate results</p>
          <p>See image to the right for details.</p>
        </Col>
        <Col xs={6}>
          <Image src={Api}></Image>
        </Col>
      </Row>
      <Row className='text-center my-3'>
        <h3>
          The full system design is visible in this <a href='https://www.figma.com/file/Z1puaOabg8GjFQlxAKSos0/Threadalytics-System-Design?type=whiteboard&node-id=0%3A1&t=WKmPR9yLw7fZu7sh-1'>FigJam file</a>
        </h3>
      </Row>
    </div>
  )
}

export default Design