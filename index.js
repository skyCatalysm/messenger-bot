'use strict'

// Imports dependencies and set up http server
require('dotenv').config()
const
  express = require('express'),
  functions = require('./functions'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()),
  VERIFY_TOKEN = process.env.VERIFY_TOKEN

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'))

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Parse the query params
  let mode = req.query['hub.mode']
  let token = req.query['hub.verify_token']
  let challenge = req.query['hub.challenge']

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      functions.messengerInit(res, challenge)
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403)
    }
  }
})

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {
  let body = req.body

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0]
      console.log(webhook_event)

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id
      console.log('Sender PSID: ' + sender_psid)

      // Set a seen indicator
      functions.senderAction(sender_psid, 'mark_seen').then(() => {
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          functions.handleMessage(sender_psid, webhook_event.message)
        } else if (webhook_event.postback) {
          functions.handlePostback(sender_psid, webhook_event.postback)
        }

      })
    })

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED')
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404)
  }

})
