import React, {Component} from 'react'
import Fade from 'react-reveal'
import {FaCloud} from 'react-icons/fa'
import Cloud from 'react-d3-cloud'
import {stopwords} from './stopwords'
import * as d3 from 'd3'
 
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
 
export default class WordCloud extends Component {

  constructor(props){
    super(props)
    this.state = {
      comments: [{text: '', value: 0}],
      data: [],
      width: 0
    }
  }
  
  componentDidMount(){
    let words = {}
    this.props.comments.forEach(c => {
      const text = c.body
      const fixedText = text.replace(/(~|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|'|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,'').toLowerCase().split(' ')
      fixedText.forEach(w => {
        if(stopwords.indexOf(w)===-1){
          if(! (w in words))
            words[w] = 0
          words[w]++
        }
      })
    })

    let data = []

    for(let w in words)
      data.push({'text': w, 'value': words[w]})

    const width = window.innerWidth<=760 ? document.getElementById('wordCloudCol').offsetWidth-20 : document.getElementById('wordCloudCol').offsetWidth

    this.setState({comments: this.props.comments, data, width})

    if(d3.select('#wordCloud').selectAll('text').size()===this.state.data.length)
      d3.select('#wordCloud').selectAll('text')
        .style('font-family', function(){
            return 'Action Bold NBA'
        })
  }

  onWordMouseOver(data) {
     d3.select('#wordCloud').selectAll('text')
        .filter(function(){ 
              return d3.select(this).text() === data.text
        })
        .style('font-size', '50px')
        .style('fill', function(){
          data.fill = d3.select(this).style('fill')
          return 'gold'
        })
  }

  onWordMouseOut(data) {
     d3.select('#wordCloud').selectAll('text')
        .filter(function(){ 
              return d3.select(this).text() === data.text
        })
        .style('font-size', data.size + 'px')
        .style('fill', function(){
          return data.fill
        })
  }

  render() {
    return (
      <Fade duration={10000}>
        <div style={{width: '100%', height: '100%'}} id='wordCloud'>
          <h3>
            <FaCloud style={{marginRight: '10px'}} />
            Word Cloud
          </h3>
          <Cloud
            data={this.state.data}
            fontSizeMapper={d => fontSizeMapper(d, this.state.data.length)}
            rotate={rotate}
            onWordMouseOver={this.onWordMouseOver}
            onWordMouseOut={this.onWordMouseOut}
            width={this.state.width}
            style={{'.div > .svg > .text': 'Action Bold NBA !important'}}
          />
        </div>
      </Fade>
    )
  }
}

