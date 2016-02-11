import { Mandrill } from 'mandrill-api/mandrill';
import addressparser from 'addressparser';

import partial from 'lodash.partial';
import groupBy from 'lodash.groupby';
import isUndefined from 'lodash.isundefined';
import isFunction from 'lodash.isfunction';
import isArray from 'lodash.isarray';
import constant from 'lodash.constant';
import merge from 'lodash.merge';
import pick from 'lodash.pick';
import omit from 'lodash.omit';
import cond from 'lodash.cond';
import first from 'lodash.first';
import flatten from 'lodash.flatten';
import has from 'lodash.has';

const packageInfo = require('../package.json');
const TRANSPORTER_NAME = 'MandrillTemplate';
 
function formatEmail(type, item) {
  const hasAddr = (item) => has(item, 'address') || has(item, 'email');

  return cond([

    [isUndefined, constant([])],

    [isFunction, (arr) => formatEmail(type, arr())],
   
    [hasAddr, (arr) =>
      ({
        email: arr.address,
        name: arr.name,
        type
      })
    ],
   
    [isArray, (arr) => arr.map((item) => formatEmail(type, item))],
    
    [constant(true), (arr) => {
      const emailList = addressparser(arr) || [];
      return emailList.map(({ address: email, name }) => ({ email, name, type }));
    }]
   
  ])(item);
}

function formatHeader(data) {
  return merge(
    data.headers, 
    { 'Reply-To': data.replyTo }
  );
}

/*
* Need to rewrite this function to be more readable 
*/
function formatMailOptions(data) {
  const toUnflatten = ['to', 'cc', 'bcc'].map((type) => formatEmail(type, data[type]));
  const to = [].concat(...flatten(toUnflatten));
  
  const {
    email: from_email,
    name: from_name
  } = first(formatEmail('from', data.from)) || {};

  const message = merge(
    {
      headers: formatHeader(data)
    },

    omit(data, 
      'template_name',
      'template_content',
      'from',
      'cc', 
      'to', 
      'bcc', 
      'replyTo'
    ), 

    {
      from_email,
      from_name,
      to,
    }
  );

  return merge(
    pick(data, 'template_name', 'template_content'),
    { message }
  );
}

function send(mandrillClient, mail) {
  return new Promise((resolve, reject) => {
    const onSuccess = (results) => {
      const mailerResponse = groupBy(results, 'status');
      mailerResponse.messageId = (results[0] || {})._id;
      resolve(mailerResponse);
    };

    const payload = formatMailOptions(mail.data);
    mandrillClient.messages.sendTemplate(payload, onSuccess, reject);
  });
}

export default function ({ auth }) {
  const mandrillClient = new Mandrill(auth.apiKey);
  const mandrillSend = partial(send, mandrillClient);

  const validApiRequest = (callback) => (mailerResponse) => callback(null, mailerResponse);
  const invalidApiRequest = (callback) => (err) => callback(err);

  return {
    version: packageInfo.version,
    name: TRANSPORTER_NAME,
    client: mandrillClient,
    send: (mail, callback) => {
      return mandrillSend(mail)
        .then(validApiRequest(callback))
        .catch(invalidApiRequest(callback));
    }
  }
}
