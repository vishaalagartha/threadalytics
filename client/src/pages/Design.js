import Header from '../components/Header'
import { Row, Col, Image } from 'react-bootstrap'
import Api from '../assets/api.png'
import DB from '../assets/db.png'
import Design_ from '../assets/design.png'
import TechStack from '../assets/tech_stack.png'


const Design = () => {

  return (
    <div>
      <Header />
      <Row className='mt-3 text-center'>
        <h1>
          So... how does this work?
        </h1>
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
            <li>Display top player sentiment scores and update every hour</li>
            <li>Display sentiment scores in a graphical representation (i.e. bar chart)</li>
            <li>Show some sentences that contributed to the score</li>
          </ul>
        </Col>
        <Col xs={6}>
          <h3 className='text-center'>
            Non-Functional Requirements
          </h3>
          <ul>
            <li>Performance/Latency - users should not have to wait a long time to see results</li>
            <li>Usability - graphical representation should be aesthetic and intuitive to understand</li>
          </ul>
        </Col>
        <Row className='mt-3'>
          <Col xs={6}>
            Based on these requirements, we can justify the following tech stack:
            <ul>
              <li>ReactJS (frontend framework)</li>
              <li><a href='https://d3js.org/'>D3JS</a> (data visualization)</li>
              <li>NodeJS (backend framework)</li>
              <li>Python (scraping and sentiment analysis)</li>
              <li>AWS S3 (static website hosting)</li>
              <li>AWS EC2 (server hosting)</li>
              <li>DynamoDB (database)</li>
              <li>Route53 + Cloudfront (CDN, domain hosting, and SSL certificate management)</li>
            </ul>
            Let's dive a little deeper into some specifics
          </Col>
          <Col xs={4}>
            <Image src={TechStack} width={'100%'} />
          </Col>
        </Row>
        <Row className='mt-3'>
          <h4>
            Sentiment Service
          </h4>
          <Col xs={3}>
            <Image src={DB} width={'100%'} />
          </Col>
          <Col xs={8}>
            <p className='inline-block'>
              <br/>
              To reduce load on our server, we will provision another EC2 instance termed the sentiment service which will be responsible
              for scraping data from Reddit and sentiment analysis. Scraping and sentiment computation will be performed every hour.
              <br/>
              Reddit scraping will be performed using the popular Python reddit api <a className='inline-link' href='https://praw.readthedocs.io/en/stable/'>PRAW</a>.
              <br/>
              Sentiment analysis will be performed using Python's <a href='https://www.nltk.org/'>NLTK</a> module.
              More specifically, we will aggregate the top comments from reddit and perform some part of speech tagging to identify the
              Proper Noun Phrases (singular and plural) in the sentence. 
              <br />
              If there are any proper nouns, we will compute the compound score
              using the <a href='https://github.com/cjhutto/vaderSentiment'>VADER</a> sentiment analysis library.
              Finally, we will store the positive and negative sentences in a DynamoDB table termed `sentiment_sentences`. We will also add a TTL
              to each element in the table so that the element persists for at least a day.
              <br/>
              Every hour, we will look at this table and write to a second table termed `sentiment_scores` to update every player's sentiment.
              This table will maintain the latest scores for our backend to quickly retrieve.
              <br/>
              The idea here is to have 2 tables. One table has the sentences and all the historical data. The other will have the latest hourly scores for fast retrieval.
            </p>
          </Col>
        </Row>
        <Row className='mt-3'>
          <h4>
            AWS Infrastructure
          </h4>
          <Col xs={4}>
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
          <Col xs={{ span: 4, offset: 2 }}>
            <Image src={Design_} width={'100%'} />
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col xs={4}>
            <h4>
              API Design
            </h4>
            <p className='inline-block'>
              Endpoint: <a href='https://api.threadalytics.com'>https://api.threadalytics.com</a>
            </p>
            <p>
              We only need 2 endpoints in our API - one to obtain the top `n` scores and another to obtain the relevant sentences for a player.
              <br />
              See the table to for specifics:
            </p>
          </Col>
          <Col xs={6}>
            <Image src={Api} width={'100%'} />
          </Col>
        </Row>
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