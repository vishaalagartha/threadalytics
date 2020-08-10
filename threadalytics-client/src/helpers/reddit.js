import { TEAM_ABBR_TO_TEAM, TEAM_TO_SUBREDDIT } from './constants'

export const getNBAGameThread = (home, away, timestamp) => {
    const homeName = TEAM_ABBR_TO_TEAM[home]
    const awayName = TEAM_ABBR_TO_TEAM[away]
    const before = new Date().getTime()
    const url = `https://api.pushshift.io/reddit/search/submission/?subreddit=nba&after=${timestamp}&before=${before}&q=GAME%20THREAD&selftext=Reddit%20Stream&sort=asc`
    return fetch(url)
      .then(res => res.json())
      .then(res => {
          const data = res.data
          for(const i in data){
            const title = data[i].title
            if(title.includes(homeName) && title.includes(awayName)){
              return data[i]
            }
          }
          return null
       })
}

export const getTeamGameThread = (teamAbbr, opponentAbbr, timestamp) => {
  const teamSubreddit = TEAM_TO_SUBREDDIT[TEAM_ABBR_TO_TEAM[teamAbbr]].substr(2)
  let query = `game%20thread`
  const before = new Date().getTime()
  if(teamSubreddit==='NOLAPelicans')
    query=`GDT`
  else if(teamSubreddit==='CharlotteHornets')
    query=`Charlotte%20Hornets`
  const url = `https://api.pushshift.io/reddit/search/submission/?subreddit=${teamSubreddit}&after=${timestamp}&before=${before}&q=${query}`
  return fetch(url)
    .then(res => res.json())
    .then(res => {
      return res.data[0]
    })
}
