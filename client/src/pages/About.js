import Header from '../components/Header'
import { Row, Col, Container, Image } from 'react-bootstrap'
import { FaInstagramSquare, FaLinkedin } from 'react-icons/fa'
import Profile from '../assets/profile.png'

const About = () => {

  return (
    <div>
      <Header />
      <Container className='ml-3 mt-3'>
        <h1>
          Who am I?
        </h1>
        <Row>
          <Col xs={8}>
            <div>
              I am a 26 year old software engineer who recently completed an M.S. in Software Engineering at Carnegie Mellon University located in the Silicon Valley. 
              Prior to beginning my masters, I spent 2 years working as a software engineer specializing in front-end development at Wells Fargo Inc. after graduating from UCLA with a B.S. in Computer Science. 
              My other passions include rockclimbing and sports analytics.
            </div>
            <div>
              On the rockclimbing spectrum, I amm primarily a boulderer. Bouldering consists of short `problems` compared to sport climbing or even big wall climbing. 
              Routes are typically 20-30 ft off the ground and require anywhere from 10 seconds to a minute of intense movement.
            </div>
            <div>
              Although I enjoy data visualization and front end engineering, I am also extremely passionate about career goal is NBA sports analytics. 
              Hence, I spend a lot of my free time trying to find interesting patterns and insights into the wild, dynamic sport of basketball. 
              My dream job is to work in the cross-section of computer science and sports. 
              I believe the NBA is undergoing a technological revolution and teams can gain an edge by analyzing large amounts of data via artificial intelligence and machine learning algorithms.
            </div>
            <div>
              The goal of this project was to test my capabilities as a DevOps engineer by leveraging several Amazon Web Services (AWS) tools.
              These tools included EC2, DynamoDB, Route53, Cloudfront, S3, and Certificate Manager. For more information, refer to the <a href='/design'>How it Works</a> page.
            </div>
            <div>
              Feel free to connect me on Instagram, LinkedIn, or via <a href='mailto: vishaalagartha@gmail.com'>email</a>
            </div>
            <div className='mt-3'>
              <a href='https://instagram.com/vishaalagartha'>
                <FaInstagramSquare size={50} />
              </a>
              <a href='https://linkedin.com/in/vishaal-agartha'>
                <FaLinkedin size={50} />
              </a>
            </div>
          </Col>
          <Col xs={4}>
            <Image src={Profile} width={'100%'} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default About