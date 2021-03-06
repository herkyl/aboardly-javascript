var xhr = require('xhr');
var series = require('async-series');

var customer
  , auth
  , baseUrl = 'https://www.aboardly.com/api/v1/';

function customerRequest(callback) {
  xhr({
    uri: baseUrl + 'customers/' + customer.id,
    method: 'PUT',
    useXDR: true,
    body: JSON.stringify(customer.options),
    headers: {
      'Authorization': 'Basic ' + btoa(auth + ':jsclient'),
      'Content-Type': 'application/json'
    }
  }, callback);
}

function eventRequest(name, properties, callback) {
  xhr({
    uri: baseUrl + 'customers/' + customer.id + '/events/' + name,
    method: 'POST',
    body: JSON.stringify(properties),
    useXDR: true,
    headers: {
      'Authorization': 'Basic ' + btoa(auth + ':jsclient'),
      'Content-Type': 'application/json'
    }
  }, callback);
}

function eventFlowWithIdentify(eventName, eventProperties, callback) {
  series([
    function (next) {
      if (!customer) {
        return callback(new Error('Identify customer before sending an event'));
      }
      customerRequest(function (error, response, body) {
        if (error || response.statusCode >= 400) {
          callback(error, response);
        } else {
          next();
        }
      });
    },
    function (next) {
      eventRequest(eventName, eventProperties, function (error, response, body) {
        callback(error, response);
      });
    }
  ]);
}

var api = {
  auth: function (_auth, options) {
    auth = _auth;
    options = options || {};
    baseUrl = options.baseUrl || baseUrl;
  },
  identify: function (id, options) {
    customer = {
      id: id,
      options: options
    };
  },
  event: function (name, properties, callback) {
    callback = callback || function (error, response) {
      if (error) {
        throw error;
      } else if (response.statusCode >= 400) {
        throw new Error(response.body);
      }
    };
    if (typeof properties == 'function') {
      callback = properties;
      properties = {};
    }
    properties = properties || {};
    eventRequest(name, properties, function (error, response, body) {
      if (response.statusCode === 400 && response.body.indexOf('Customer does not exist') > -1) {
        eventFlowWithIdentify(name, properties, callback);
      } else {
        callback(error, response);
      }
    });
  }
};

if (window._ab instanceof Array) {
  for (var i = 0; i < window._ab.length; i++) {
    var element = window._ab[i];
    api[element.fn].apply(api, element.args);
  }
  window.aboardly = api;
}
