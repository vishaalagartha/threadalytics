import AWS from 'aws-sdk'
import * as csv from '@fast-csv/parse'
import * as fs from 'fs'
import * as path from 'path'

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4',
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
})

const parseCSV = async (csvFile, delimiter = ';') => {
  let data = []
  return new Promise((resolve, reject) => {
    csv.parseStream(csvFile, { headers: true, delimiter, quote: null })
      .on('data', (d) => {
        data.push(d)
      })
      .on('end', () => {
        resolve(data)
      })
      .on('error', (error) => {
        reject(error)
      })    
  })
  
}

const getBucketContents = async (key, delimiter = ',') => {
  return new Promise(async (resolve, reject) => {
      const params = { Bucket: 'threadalytics-data', Key: key }
      const csvFile = s3.getObject(params).createReadStream()
      .on('error', (e) => {
        reject(e)
      })
      const res = await parseCSV(csvFile, delimiter)
      resolve(res)
  })
}

export { getBucketContents }