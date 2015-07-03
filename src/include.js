(function () {
  window._ab = window._ab || [];
  window.aboardly = {};
  var funcs = ['identify', 'event', 'auth'];
  for (var i = 0; i < funcs.length; i++) {
    var fn = funcs[i];
    window.aboardly[fn] = (function (fn) {
      return function () {
        window._ab.push({
          args: arguments,
          fn: fn
        });
      }
    })(fn)
  }

  var newElement = document.createElement('script')
    , oldElement = document.getElementsByTagName('script')[0];
  newElement.async = 1;
  newElement.src = './build/index.js';
  oldElement.parentNode.insertBefore(newElement, oldElement);
})();
