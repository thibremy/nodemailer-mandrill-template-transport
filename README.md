# nodemailer-mandrill-template-transport

A Mandrill transport for Nodemailer, it's a mix beetween [nodemailer-mandrill-template-transport](https://github.com/RebelMail/nodemailer-mandrill-transport) and commons E-mail message fields

This package is used to use "Mandrill.message#send-template".

## Example

```javascript
import nodemailer from 'nodemailer';
import mandrillTemplateTransport from 'nodemailer-mandrill-template-transport';

const transport = nodemailer.createTransport(mandrillTemplateTransport({
  auth: {
    apiKey: 'key'
  }
}));

transform to mandrill options

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