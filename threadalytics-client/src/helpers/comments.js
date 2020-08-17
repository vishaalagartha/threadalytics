import vader from 'vader-sentiment'

const addTones = data => {
  const newData = data.filter(d => (d.author!=='[deleted]' && d.body!=='[deleted]'))
  newData.forEach(d => {
    d.tones = vader.SentimentIntensityAnalyzer.polarity_scores(d.body)
  })
  return newData
}

const fetchGameCommentsPushshift = (id, after, comments) => {
  const url = `https://api.pushshift.io/reddit/comment/search/?link_id=${id}&limit=500&after=${after}`

  return fetch(url)
    .then(res => res.json())
    .then(
      result => {
        const data = result.data
        if(data.length===0) return comments

        after = data[data.length-1].created_utc
        const nResults = data.length 
        comments = [...comments, ...addTones(data)]
        if(nResults===500)
          return fetchGameCommentsPushshift(id, after, comments)
        else
          return comments
      })
  }

export const fetchGameComments = (id, after, comments) => {
    return fetch('https://threadalytics.com/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: id})
      })
      .then(res => res.json())
      .then(comments => {
        comments = [...addTones(comments)]
        return comments
      })
      .catch(e => {
         return fetchGameCommentsPushshift(id, after, [])
      })
}
