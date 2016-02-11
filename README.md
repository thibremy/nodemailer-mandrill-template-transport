# nodemailer-mandrill-transport

A Mandrill transport for Nodemailer.

[![Build Status](https://travis-ci.org/Rebelmail/nodemailer-mandrill-transport.svg?branch=sm-readme)](https://travis-ci.org/Rebelmail/nodemailer-mandrill-transport)
[![NPM version](https://badge.fury.io/js/nodemailer-mandrill-transport.png)](http://badge.fury.io/js/nodemailer-mandrill-transport)

## Example

```javascript
'use strict';

var nodemailer = require('nodemailer');

var mandrillTransport = require('nodemailer-mandrill-transport');

var transport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: 'key'
  }
}));

transport.sendMail({
  from: 'sender@example.com',
  to: 'user@example.com',
  subject: 'Hello',
  html: '<p>How are you?</p>'
}, function(err, info) {
  if (err) {
    console.error(err);
  } else {
    console.log(info);
  }
});
```

## Using Mandrill API options



```javascript
transport.sendMail({
   data: {
      template_name: 'contact-form',
      template_content: [],
      subject: 'Hello',
      from: 'bernie senders sender@example.com',
      to: 'user@example.com, user2@example.com',
      cc: 'cc@example.com, cc@example.com',
      bcc: [
        'foobar@blurdybloop.com', 
        {
          name: 'Майлер, Ноде',
          address: 'foobar@blurdybloop.com'
        }
      ],
      replyTo: 'test@tet.com',
      messageId: 'test',
    }
}, /* ... */);
```

transform to 

```javascript

{
  template_name: 'contact-form',
  template_content: [],
  message: {
    headers: {
      'Reply-To': 'test@tet.com'
    },
    subject: 'Hello',
    messageId: 'test',
    from_email: 'sender@example.com',
    from_name: 'bernie senders',
    to: [{
      email: 'user@example.com',
      name: '',
      type: 'to'
    }, {
      email: 'user2@example.com',
      name: '',
      type: 'to'
    }, {
      email: 'cc@example.com',
      name: '',
      type: 'cc'
    }, {
      email: 'cc@example.com',
      name: '',
      type: 'cc'
    }, {
      email: 'foobar@blurdybloop.com',
      name: '',
      type: 'bcc'
    }, {
      email: 'foobar@blurdybloop.com',
      name: 'Майлер, Ноде',
      type: 'bcc'
    }]
  }
}

```