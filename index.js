var xhr = require('xhr');
var cookie = require('component-cookie');
var customer = cookie('aboardly-js');

var customer
  , auth
  , baseUrl = 'http://www.aboardly.com/api/v1/';

var url = {
  customer: function () {
    return baseUrl + 'customers/' + customer.id;
  },
  event: function (eventName) {
    /*if (!customer) {
      throw new Error('Must identify customer before sending an event');
      return;
    }*/
    return url.customer() + '/events/' + eventName;
  }
};

var api = {
  identify: function (id, options) {
    customer = {
      id: id,
      options: options
    };
    cookie('aboardly-js', customer);
  },
  event: function (name) {
    xhr({
      uri: url.event(name),
      method: 'POST',
      useXDR: true,
      headers: {
        'Authorization': 'Basic ' + btoa(auth.username + ':' + auth.password),
        'Content-Type': 'text/plain'
      }
    }, function (error, response, body) {
      if (response.statusCode === 400 && response.body.indexOf('Customer does not exist') > -1) {
        xhr({
          uri: url.customer(),
          method: 'PUT',
          useXDR: true,
          body: JSON.stringify(customer.options),
          headers: {
            'Authorization': 'Basic ' + btoa(auth.username + ':' + auth.password),
            'Content-Type': 'text/plain'
          }
        }, function (error, response, body) {
          console.log(arguments);
        });
      }
    });
  }
};

window.aboardly = function (_auth, options) {
  auth = _auth;
  options = options || {};
  baseUrl = options.baseUrl || baseUrl;
  return api;
};
