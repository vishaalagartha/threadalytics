const express = require('express')
const http = require('http')
const https = require('https')
const fs = require('fs')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'threadalytics-client/build'), {
	index: false
}))

// Handles any requests that don't match the ones above
app.get('*', (req,res, next) => {
	if(process.env.PORT)
		res.sendFile(path.join(__dirname+'/threadalytics-client/build/index.html'))
	else{
		if (!req.headers.host.match(/^www/)){ 
			return res.redirect('https://www.' + req.headers.host + req.url, 301)
		}
		if(req.secure)
			res.sendFile(path.join(__dirname+'/threadalytics-client/build/index.html'))
		else
			res.redirect('https://' + req.headers.host + req.url)
	}
})
if(!process.env.PORT){
	const privateKey = fs.readFileSync('/etc/letsencrypt/live/threadalytics.com/privkey.pem', 'utf8')
	const certificate = fs.readFileSync('/etc/letsencrypt/live/threadalytics.com/cert.pem', 'utf8')
	const ca = fs.readFileSync('/etc/letsencrypt/live/threadalytics.com/chain.pem', 'utf8')
	const credentials = {
		key: privateKey,
		cert: certificate,
		ca: ca
	}
	// Starting both http & https servers
	const httpServer = http.createServer(app).listen(80, () => {
		console.log('HTTP Server running on port 80')
	})
	const httpsServer = https.createServer(credentials, app).listen(443, () => {
		console.log('HTTPS Server running on port 443')
	})
}
else{
	const httpServer = http.createServer(app).listen(process.env.PORT, () => {
		console.log('HTTP Server running on port '+process.env.PORT)
	})
}
