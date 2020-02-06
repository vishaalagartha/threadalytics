import React, { Component } from 'react'
import { Navbar, Image } from 'react-bootstrap'
import logo from 'assets/images/logo.png'

export default class Header extends Component {
  render() {
    return (
      <div>
        <Navbar bg='dark' variant='dark'>
          <Navbar.Brand href='/'>
            <Image src={logo} width='30' height='30' roundedCircle />
            {'  '}
            THREADALYTICS
          </Navbar.Brand>
        </Navbar>
      </div>
    )
  }
}
