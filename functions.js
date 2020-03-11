// Imports dependencies and set up http server
require('dotenv').config()
const
  request = require('request'), // creates express http server
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
  replies = require('./replies')

//Function to be exported
module.exports = {
  // Sends response messages via the Send API
  callSendAPI: function (sender_psid, response_array) {
    if (parseInt(response_array.length) === 0) {
      return
    }
    this.senderAction(sender_psid, 'typing_on').then(() => {
      let response = response_array[0]

      // Construct the message body
      let request_body = {
        'recipient': {
          'id': sender_psid
        },
        'message': response
      }

      let randomTimeout = Math.floor(Math.random() * (1000 - 500 + 1) + 500)

      setTimeout(function () {
        // Send the HTTP request to the Messenger Platform
        request({
          'uri': 'https://graph.facebook.com/v2.6/me/messages',
          'qs': { 'access_token': PAGE_ACCESS_TOKEN },
          'method': 'POST',
          'json': request_body
        }, (err, res, body) => {
          if (!err) {
            console.log('message sent!')
            response_array.shift()
            this.senderAction(sender_psid, 'typing_off').then(() => {
              this.callSendAPI(sender_psid, response_array)
            })
          } else {
            console.error('Unable to send message:' + err)
          }
        })
      }.bind(this), randomTimeout)
    })
  },
  //Initialize the page messenger
  messengerInit: function (res, challenge) {
    // Responds with the challenge token from the request
    console.log('WEBHOOK_VERIFIED')

    // Set up get started button
    let request_body = {
      'get_started': {
        'payload': 'GET_STARTED'
      },
      'greeting': [
        {
          'locale': 'default',
          'text': 'Hello {{user_first_name}}! Message us.'
        }
      ],
      'persistent_menu': [
        {
          'locale': 'default',
          'composer_input_disabled': false,
          'call_to_actions': [...replies.DEFAULT_BUTTONS]
        }
      ],
      "ice_breakers":[
        {
          "question": "Jobs Available",
          "payload": "JOBS_AVAILABLE_IB",
        },
        {
          "question": "Location and Office hrs",
          "payload": "LOCATION_AND_OFFICE_HRS_IB",
        },
        {
          "question": "About YNS",
          "payload": "ABOUT_YNS_IB",
        }
      ]
    }
    request({
      'uri': 'https://graph.facebook.com/v2.6/me/messenger_profile',
      'qs': { 'access_token': PAGE_ACCESS_TOKEN },
      'method': 'POST',
      'json': request_body
    }, (err, res, body) => {
      if (!err) {
        console.log('message sent!')
      } else {
        console.error('Unable to send message:' + err)
      }
    })

    res.status(200).send(challenge)
  },
  // Handles messaging_postbacks events
  handlePostback: async function (sender_psid, received_postback) {
    let response

    // Get the payload for the postback
    let payload = received_postback.payload

    // Set the response based on the postback payload
    switch (payload) {
      case 'LOCATION_AND_OFFICE_HRS':
        response = [...replies.LOCATION_AND_OFFICE_HRS]
        break
      case 'ABOUT_YNS':
        response = [...replies.ABOUT_YNS]
        break
      case 'JOBS_AVAILABLE':
        response = [...replies.JOBS_AVAILABLE]
        break
      case 'LOCATION_AND_OFFICE_HRS_IB':
        response = [...replies.LOCATION_AND_OFFICE_HRS]
        break
      case 'ABOUT_YNS_IB':
        response = [...replies.ABOUT_YNS]
        break
      case 'JOBS_AVAILABLE_IB':
        response = replies.GET_STARTED(await this.getFirstName(sender_psid))
        response.push(replies.JOBS_AVAILABLE[0])
        console.log(response);
        break
      default:
        response = replies.GET_STARTED(await this.getFirstName(sender_psid))
        break
    }

    // Send the response message
    this.callSendAPI(sender_psid, response)
  },
  // Handles messages that are not from the buttons
  handleMessage: async function (sender_psid, received_message) {
    let firstName = await this.getFirstName(sender_psid)
    let response = [{
      'text': 'Hi ' + firstName + '! We appreciate you contacting us. ' +
        'One of our colleagues will get back in touch with you soon!\n\nHave a great day!'
    }]

    // Send the response message
    this.callSendAPI(sender_psid, response)
  },
  getFirstName: function (sender_psid) {
    return new Promise(resolve => {
      request({
        'uri': 'https://graph.facebook.com/v2.6/' + sender_psid,
        'qs': {
          'access_token': PAGE_ACCESS_TOKEN,
          'fields': 'first_name'
        },
        'method': 'GET'
      }, (err, res, body) => {
        if (!err) {
          if (body === null)
            return
          body = JSON.parse(body)
          resolve(body.first_name)
        } else {
          return
          console.error('Unable to send message:' + err)
        }
      })
    })
  },
  senderAction: function (sender_psid, action) {
    return new Promise((resolve, reject) => {
      request({
        'uri': 'https://graph.facebook.com/v2.6/me/messages',
        'qs': {
          'access_token': PAGE_ACCESS_TOKEN
        },
        'method': 'POST',
        'json': {
          'recipient': {
            'id': sender_psid
          },
          'sender_action': action
        }
      }, (err, res, body) => {
        resolve('Success!')
      })
    })
  },
}