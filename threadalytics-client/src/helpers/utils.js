export const timestampToDate = timestamp => {
    const date = new Date(timestamp*1000)
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const month = monthNames[date.getMonth()]
    let dayNum = date.getDate()
    if(dayNum<10)
      dayNum = '0' + dayNum
    const year = date.getFullYear()
    return `${month} ${dayNum}, ${year}`
}
