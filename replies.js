//Export collection of possible replies
module.exports = {
  LOCATION_AND_OFFICE_HRS: [
    {
      'text': 'Location and Office hrs\n\n' +
        'Pacific Star, Makati City \n' +
        '9 A.M - 5:30 P.M\n'
    }
  ],
  ABOUT_YNS: [
    {
      'text': 'About YNS\n\n' +
        'Who we are: \n' +
        'We are japanese company since 2009. We are IT Software company at Manila in the Phillipines.\n\n' +
        'What we do: \n' +
        'We are a technical group that uses leading-edge technology to provide Japan Quality web services and mobile apps.'
    }
  ],
  JOBS_AVAILABLE: [
    {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'generic',
          'image_aspect_ratio': 'square',
          'elements': [
            {
              'title': 'Software Engineer',
              "image_url":"https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/p960x960/86377974_2619658294938164_39865684578009088_o.jpg?_nc_cat=102&_nc_sid=8024bb&_nc_ohc=1pBTMsLpqLEAX8r8G1_&_nc_ht=scontent-hkg3-1.xx&_nc_tp=6&oh=32a02b6fdd7b1200f8c0a9dc343703f4&oe=5E8FC405",
              'subtitle': 'Execute full lifecycle software development. Write well designed, testable, efficient ...',
              'buttons': [
                {
                  'type': 'web_url',
                  'url': 'https://yns.ph/career/software-engineer/',
                  'title': 'View Details'
                }
              ]
            }, {
              'title': 'Quality Assurance Engr.',
              "image_url":"https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/p960x960/84522790_2619658308271496_5817099664138174464_o.jpg?_nc_cat=106&_nc_sid=8024bb&_nc_ohc=QTeYxjcqbpQAX_6HVsm&_nc_ht=scontent-hkg3-1.xx&_nc_tp=6&oh=8214b77a30fce0568e11552103507e56&oe=5E988658",
              'subtitle': 'Review requirements specifications and technical design documents to provide ...',
              'buttons': [
                {
                  'type': 'web_url',
                  'url': 'https://yns.ph/career/quality-assurance/',
                  'title': 'View Details'
                }
              ]
            }, {
              'title': 'Front-End Engineer',
              "image_url":"https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/p960x960/86784934_2619658284938165_6184303996258222080_o.jpg?_nc_cat=104&_nc_sid=8024bb&_nc_ohc=SFYir-LYIggAX9i8gX9&_nc_ht=scontent-hkg3-1.xx&_nc_tp=6&oh=b6a2835b066710a7eb089a9f67a9f8fa&oe=5E924D88",
              'subtitle': 'Use markup languages like HTML to create user-friendly web pages. Maintain and improve website...',
              'buttons': [
                {
                  'type': 'web_url',
                  'url': 'https://yns.ph/career/front-end-engineer/',
                  'title': 'View Details',
                  'webview_height_ratio': 'full'
                }
              ]
            }
          ]
        }
      }
    }
  ],
  GET_STARTED: function (first_name) {
    return [
      { 'text': 'Hi ' + first_name + '! Welcome to YNS PH an IT Software company in Manila in the Philippines.' },
      { 'text': 'At any time, use the menu below to navigate through the features.' },
      {
        'attachment': {
          'type': 'template',
          'payload': {
            'template_type': 'button',
            'text': 'What we can do to help you today?',
            'buttons': [...this.DEFAULT_BUTTONS]
          }
        }
      }
    ]
  },
  DEFAULT_BUTTONS: [
    {
      'type': 'postback',
      'title': 'Jobs Available',
      'payload': 'JOBS_AVAILABLE'
    },
    {
      'type': 'postback',
      'title': 'Location and Office hrs',
      'payload': 'LOCATION_AND_OFFICE_HRS'
    },
    {
      'type': 'postback',
      'title': 'About YNS',
      'payload': 'ABOUT_YNS'
    },
  ],
}