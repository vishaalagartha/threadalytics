import NBA from 'nba'
export const getPbp = () => {
  const curry = NBA.findPlayer('Stephen Curry');
  console.log(curry);
  NBA.stats.playerInfo({ PlayerID: curry.playerId }).then(console.log);
  /*
  fetch('https://cors-anywhere.herokuapp.com/http://data.nba.com/data/5s/json/cms/noseason/game/20200212/0021900807/pbp_all.json')
    .then(res => res.json())
    .then(result => {
      console.log(result)

    })
*/

}
