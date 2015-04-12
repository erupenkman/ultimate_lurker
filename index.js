var http = require('http'),
    connect = require('connect'),
    httpProxy = require('http-proxy');


var selects = [];
var simpleselect = {};

simpleselect.query = 'div';
simpleselect.func = function (node) {
  console.log('simple select');
   // node.createWriteStream().end('test123');
}


var titleCensor = {
  query: '.title',
  func: function (node) {
    node.innerHTML = 'REDACTED';
  }
}
selects.push(simpleselect);
selects.push(titleCensor);

//
// Basic Connect App
//
var app = connect();

var proxy = httpProxy.createProxyServer({
      changeOrigin: true,
      target: 'http://www.reddit.com:80'
})

//Additional true parameter can be used to ignore js and css files.
//app.use(require('../')([], selects), true);

app.use(require('harmon')([], selects));

app.use(function (req, res) {
  console.log('proxying..');
  proxy.web(req, res,'http://www.reddit.com:80');
});

http.createServer(app).listen(8000);

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<html><head></head><body><div class="a">Nodejitsu Http Proxy</div><div class="b">&amp; Frames</div></body></html>');
  res.end();
}).listen(9000);
