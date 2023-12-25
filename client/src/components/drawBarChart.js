import * as d3 from 'd3'
import { PLAYER_TO_TEAM, TEAM_COLORS, PLAYER_TO_ID, TEAM_TO_TEAM_ABBR } from '../helpers/constants'

const drawBarChart = (data, element) => {
  const { width: w, height: h } = element.getBoundingClientRect()
  const width = w
  const height = h
  const marginTop = 30
  const marginRight = 0
  const marginBottom = 30
  const marginLeft = 40
  console.log(data)
  d3.select(element).select('svg').remove()
  const svg = d3
    .select(element)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
  const x = d3.scaleBand()
  .domain(d3.groupSort(data, ([d]) => d.score, (d) => d.name))
  .range([marginLeft, width - marginRight])
  .padding(0.1)

  const y = d3.scaleLinear()
  .domain([d3.min(data, d => d.score), d3.max(data, d => d.score)])
  .range([height - marginBottom, marginTop])

  const middle = y(0)
  svg.append('g')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', d => x(d.name))
    .attr('y', d => {
      const v = y(d.score)
      if(v > middle) return middle
      return v
    })
    .attr('height', (d) => Math.abs(y(0) - y(d.score)))
    .attr('width', x.bandwidth())
    .attr('fill', d => {
      const team = PLAYER_TO_TEAM[d['name']] ?  PLAYER_TO_TEAM[d['name']]['team_abbr'] : TEAM_TO_TEAM_ABBR[d['name']]
      if(!team) return 'white'
      const mainColor = TEAM_COLORS[team]['main_color']
      const secondaryColor = TEAM_COLORS[team]['secondary_color']
      if(mainColor === 'black')
        return secondaryColor
      return mainColor
    })
    .attr('stroke-width', 2)
    .attr('stroke', d => {
      const team = PLAYER_TO_TEAM[d['name']] ?  PLAYER_TO_TEAM[d['name']]['team_abbr'] : TEAM_TO_TEAM_ABBR[d['name']]
      if(!team) return 'black'
      const mainColor = TEAM_COLORS[team]['main_color']
      const secondaryColor = TEAM_COLORS[team]['secondary_color']
      if(mainColor === 'black')
        return mainColor
      return secondaryColor
    })
    .on('mouseover', (event, d) => {
      const tooltip = document.getElementById('tooltip')
      const img = document.createElement('img')
      if(PLAYER_TO_ID[d['name']]) {
        const id = PLAYER_TO_ID[d['name']]
        img.src = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${id}.png`
      } else {
        const teamStr = d['name'].toLowerCase().replaceAll(' ', '_')
        img.src = `http://cdn.bleacherreport.net/images/team_logos/164x164/${teamStr}.png`
      }
      const text = document.createElement('p')
      text.innerText = d.sentences.replaceAll('\n\n', '\n')
      tooltip.style = 'text-overflow: ellipsis;max-width:600px;max-height:200px;position:absolute;text-align:left;font-size:8px;left:10px;top:100px;'
      tooltip.appendChild(img)
      tooltip.appendChild(text)
    })
    .on('mouseout', () => {
      const tooltip = document.getElementById('tooltip')
      tooltip.innerHTML = ''
    })

  svg.append('g')
     .selectAll('text')
     .data(data)
     .enter()
     .append('text')
     .attr('x', d => x(d.name) + x.bandwidth() / 2 - 5)
     .attr('y', d => {
      const v = y(d.score)
      if(v > middle) return middle + Math.abs(y(0) - y(d.score)) + 20
      return v - 10
    })
    .text(d => d.score.toFixed(2))

  svg.append('g')
    .attr('transform', `translate(0,${y(0)})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll('text')  
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-65)')

}

export default drawBarChart