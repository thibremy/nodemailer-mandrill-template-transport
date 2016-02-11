# nodemailer-mandrill-template-transport

A Mandrill transport for Nodemailer, it's a mix beetween [nodemailer-mandrill-transport](https://github.com/RebelMail/nodemailer-mandrill-transport) and commons [E-mail message fields](https://github.com/nodemailer/nodemailer#e-mail-message-fields).

This package use "Mandrill.message#send-template".

## Example

```javascript
import nodemailer from 'nodemailer';
import mandrillTemplateTransport from 'nodemailer-mandrill-template-transport';

const transport = nodemailer.createTransport(mandrillTemplateTransport({
  auth: {
    apiKey: 'key'
  }
}));

// transform to mandrill options

transport.sendMail({
  template_name: 'contact-form',
  template_content: [],
  subject: 'Hello',
  from: 'bernie senders sender@example.com',
  to: 'user@example.com, user2@example.com',
  cc: 'cc@example.com, cc@example.com',
  bcc: [
    'foobar@blurdybloop.com', {
      name: 'Майлер, Ноде',
      address: 'foobar@blurdybloop.com'
    }
  ],
  replyTo: 'test@tet.com',
  messageId: 'test',
});

{
  template_name: 'contact-form',
  template_content:[],
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
