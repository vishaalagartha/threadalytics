import React from 'react'
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap'
import { isMobile } from 'react-device-detect'
import { TEAM_TO_SUBREDDIT, TEAM_ABBR_TO_TEAM, TEAM_TO_TEAM_ABBR } from 'helpers/constants'
import logo from 'assets/images/logo.png'

const Header = ({team}) => {
  const titles = ['A-C', 'D-L', 'M-O', 'P-Z']

  const getTeams = title => {
    const c1 = title[0]
    const c2 = title[2]+'z'
    const filteredTeams = Object.keys(TEAM_TO_SUBREDDIT).filter(t => t>c1 && t<c2)
    return filteredTeams
  }

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
                      getTeams(t).map((el, i) => {
                        return (
                        <NavDropdown.Item key={i} href={'/teams/'+TEAM_TO_TEAM_ABBR[el.toUpperCase()]}>{el}</NavDropdown.Item>
                        )
                      })
                    }
                  </NavDropdown>
                )
              })
            }
            <Nav.Link href={team ? '/leaderboard/' + team : '/leaderboard'}>
              {team ? TEAM_TO_SUBREDDIT[TEAM_ABBR_TO_TEAM[team]] + ' Leaderboard' : 'Leaderboards'}
            </Nav.Link> 
            { isMobile ? 
              null
              :
              <Nav.Link href='/compare'>
                Compare Subreddits
              </Nav.Link>
            }
            <Nav.Link href='/user'>
              Profiles
            </Nav.Link>
            {/*
            <Nav.Link href='/guess-that-flair'>Guess that flair!</Nav.Link>
            */}
            <Nav.Link href='/about'>About Me</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
   )

}

export default Header
