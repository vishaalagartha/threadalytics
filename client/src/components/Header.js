import React from 'react'
import { Navbar, Nav, Image } from 'react-bootstrap'
import logo from '../assets/logo.png'


const Header = () => {

  return (
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
        <Navbar.Brand href='/' className='ml-5'>
          <Image src={logo} width='30' height='30' roundedCircle />
          {'  '}
          THREADALYTICS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' style={{'border': '0'}}>
        </Navbar.Toggle>
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='ml-auto mr-3'>
            <Nav.Link href='/design'>
              How it works
            </Nav.Link>
            <Nav.Link href='/about'>
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
   )

}

export default Header