import test from 'blue-tape';
import sinon from 'sinon';
import mandrillTemplateTransport from '../src/mandrill-template-transport';

const packageInfo = require('../package.json');

const options = { 
  auth: {
    apiKey: 'test'
  }
};

test('throw when auth is not set', (t) => {
  t.throws(mandrillTemplateTransport);
  return Promise.resolve();
});

test('expose name and version', (t) => {
  const transport = mandrillTemplateTransport(options);

  t.equal(transport.name, 'MandrillTemplate', 'transport name is ok');
  t.equal(transport.version, packageInfo.version, 'transport version is ok');
  return Promise.resolve();
});

test('send', (t) => {
  const transport = mandrillTemplateTransport(options);
  const { client } = transport;

  t.ok(client, 'can get client');
  
  function onSend(data, done) {
    const {
      message
    } = data;
    t.equal(data.template_name, 'contact-form', 'template_name is ok');
    t.deepEqual(data.template_content, [], 'template_content is ok');
    t.deepEqual(message.headers, { 'Reply-To': 'test@tet.com' }, 'message.headers is ok');
    t.equal(message.subject, 'Hello', 'message.subject is ok');
    t.equal(message.messageId, 'test', 'message.messageId is ok');
    t.equal(message.from_email, 'sender@example.com', 'message.from_email is ok');
    t.equal(message.from_name, 'bernie senders', 'message.from_name is ok');
    t.deepEqual(message.to, [{
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
      },
      {
        email: 'foobar@blurdybloop.com',
        name: '',
        type: 'bcc'
      }, {
        email: 'foobar@blurdybloop.com',
        name: 'Майлер, Ноде',
        type: 'bcc'
      }
    ], 'message.to is ok');

    const fakeReponse = [{
        email: 'user@example.com',
        _id: 'fake-id-1',
        status: 'sent', 
      }, {
        email: 'user2@example.com',
        _id: 'fake-id-2',
        status: 'queued', 
      }, {
        email: 'cc@example.com',
        _id: 'fake-id-3',
        status: 'rejected'
      }, {
        email: 'foobar@blurdybloop.com',
        _id: 'fake-id-4',
        status: 'invalid'
      },
    ];

    done(fakeReponse);
  }

  const payload = {
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
  };

  const sendStub = sinon.stub(client.messages, 'send', onSend);
  const sendTemplateStub = sinon.stub(client.messages, 'sendTemplate', onSend);

  return new Promise((resolve, reject) => {
    transport.send(payload, (err, info) => {
      t.deepEqual(info, {
        sent: [{
          email: 'user@example.com',
          _id: 'fake-id-1',
          status: 'sent'
        }],
        queued: [{
          email: 'user2@example.com',
          _id: 'fake-id-2',
          status: 'queued'
        }],
        rejected: [{
          email: 'cc@example.com',
          _id: 'fake-id-3',
          status: 'rejected'
        }],
        invalid: [{
          email: 'foobar@blurdybloop.com',
          _id: 'fake-id-4',
          status: 'invalid'
        }],
        messageId: 'fake-id-1'
      }, 'send result is ok');
      return err ? reject(err) : resolve(info);
    });
  });
});
