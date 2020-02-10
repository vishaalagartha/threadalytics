import React, { Component } from 'react'
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap'
import { TEAM_TO_TEAM_ABBR } from 'helpers/constants'
import logo from 'assets/images/logo.png'

const teams = ['Atlanta Hawks',
   'Boston Celtics',
   'Brooklyn Nets',
   'Charlotte Hornets',
   'Chicago Bulls',
   'Cleveland Cavaliers',
   'Dallas Mavericks',
   'Denver Nuggets',
   'Detroit Pistons',
   'Golden State Warriors',
   'Houston Rockets',
   'Indiana Pacers',
   'Los Angeles Clippers',
   'Los Angeles Lakers',
   'Memphis Grizzlies',
   'Miami Heat',
   'Milwaukee Bucks',
   'Minnesota Timberwolves',
   'New Orleans Pelicans',
   'New York Knicks',
   'Oklahoma City Thunder',
   'Orlando Magic',
   'Philadelphia 76ers',
   'Phoenix Suns',
   'Portland Trail Blazers',
   'Sacramento Kings',
   'San Antonio Spurs',
   'Toronto Raptors',
   'Utah Jazz',
   'Washington Wizards']

export default class Header extends Component {

  getTeams(title){
    const c1 = title[0]
    const c2 = title[2]+'z'
    const filteredTeams = teams.filter(t => t>c1 && t<c2)
    return filteredTeams
  }

  render() {
    const titles = ['A-C', 'D-L', 'M-O', 'P-Z']
    return (
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
        <Navbar.Brand href='/'>
          <Image src={logo} width='30' height='30' roundedCircle />
          {'  '}
          THREADALYTICS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' style={{'border': '0'}}>
        </Navbar.Toggle>
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='mr-auto'>
            <Nav.Link href='/'>All Teams</Nav.Link>
            {
              titles.map((t, i) => {
                return (
                  <NavDropdown key={i} title={t}>
                    {
                      this.getTeams(t).map((el, i) => {
                        return (
                        <NavDropdown.Item key={i} href={'/teams/'+TEAM_TO_TEAM_ABBR[el.toUpperCase()]}>{el}</NavDropdown.Item>
                        )
                      })
                    }
                  </NavDropdown>
                )
              })
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
