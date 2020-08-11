import React, {Component} from 'react'
import * as d3 from 'd3'
import Cloud from 'react-d3-cloud'

const fontSizeMapper = (word, numWords) => {
  let multiplier
  if(numWords<1000)
    multiplier = 20
  else if(numWords<3000)
    multiplier = 10
  else if(numWords<4000)
    multiplier = 5
  else
    multiplier = 2
  return Math.log2(word.value) * multiplier
}
const rotate = word => word.value % 360;

const onWordMouseOver = data => {
   d3.select('#wordCloud').selectAll('text')
      .filter(function(){ 
            return d3.select(this).text() === data.text
      })
      .style('font-size', '50px')
      .style('fill', function(){
        data.fill = d3.select(this).style('fill')
        return  '#b30000'
      })
}

const onWordMouseOut = data => {
   d3.select('#wordCloud').selectAll('text')
      .filter(function(){ 
            return d3.select(this).text() === data.text
      })
      .style('font-size', data.size + 'px')
      .style('fill', function(){
        return data.fill
      })
}
 

export default class WordCloud extends Component {
  shouldComponentUpdate(){
    return true
  }

  render(){
    const {data, width} = this.props
    return (
          <Cloud
            data={data}
            fontSizeMapper={d => fontSizeMapper(d, data.length)}
            rotate={rotate}
            onWordMouseOver={onWordMouseOver}
            onWordMouseOut={onWordMouseOut}
            width={width}
            style={{'.div > .svg > .text': 'Action Bold NBA !important'}}
          />
    )
  }
}
