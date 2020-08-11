import React, {Component} from 'react'
import Fade from 'react-reveal'
import {FaCloud} from 'react-icons/fa'
import {stopwords} from './stopwords'
import * as d3 from 'd3'
import ReactBootstrapSlider from 'react-bootstrap-slider';
import Cloud from './wrapper'
import _ from "lodash"

 
export default class WordCloud extends Component {

  constructor(props){
    super(props)
    this.state = {
      comments: [{text: '', value: 0}],
      data: [],
      wordCloudData: [],
      width: 0,
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

    for(let w in words){
      data.push({'text': w, 'value': words[w]})
    }

    data = data.sort((a, b) => {return b.value-a.value})

    const width = window.innerWidth<=760 ? document.getElementById('wordCloudCol').offsetWidth-20 : document.getElementById('wordCloudCol').offsetWidth

    this.setState({comments: this.props.comments, wordCloudData: _.cloneDeep(data), data, width})

    if(d3.select('#wordCloud').selectAll('text').size()===this.state.data.length)
      d3.select('#wordCloud').selectAll('text')
        .style('font-family', function(){
            return 'Action Bold NBA'
        })
  }



  render() {
    return (
      <Fade duration={10000}>
        <div style={{width: '100%', height: '100%', background: 'white'}} id='wordCloud'>
          <h3>
            <FaCloud style={{marginRight: '10px'}} />
            Word Cloud
          </h3>
          <Cloud data={this.state.wordCloudData} width={this.state.width}/>
          <h3>
            Cloud size: {this.state.wordCloudData.length}
          </h3>
          <ReactBootstrapSlider
            value={this.state.wordCloudData.length}
            slideStop={(e) => {
              this.setState({...this.state, wordCloudData: _.cloneDeep(this.state.data).slice(0, e.target.value)}
            )}}
            ticks={Array.from(Array(this.state.data.length).keys())}
            step={10}
            max={this.state.data.length}
            min={0}
            orientation='horizontal'
          />
        </div>
      </Fade>
    )
  }
}

