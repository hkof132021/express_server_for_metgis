var express = require('express');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static')
var serveIndex = require('serve-index')
var fileUpload = require('express-fileupload');
var cors = require('cors');
var morgan = require('morgan')
var fs = require('fs');
var app = express();
var dotenv = require('dotenv')


// import other modules
var api_controller = require('./controller/api_controller.js');
var test_controller = require('./controller/test_controller.js');


// ---------------------------   Get env variable  -----------------
const envConfig = dotenv.parse(fs.readFileSync('.env'))
var port = envConfig['port']
var host = envConfig['host']


// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))


// print request ---- Calling http://protus:8085/images/
const logger = function (req, res, next) {
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log('---- Calling ' +　url);
    
    next();
  }
// ---------------------------   APP init  -----------------
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));
app.use(cors());
app.use(fileUpload());

// api_router
var api_router = express.Router();
var test_router = express.Router();

app.use('/test',test_router);
app.use('/api',api_router);
app.use(logger);
options = {
    'icons': true, 
    stylesheet : 'public/style.css'
}

var directory = "/home/billchan/node_server/images"  // express server post
var directory2 = "/home/billchan/node_server/addon_data"

// http://protus:8085/images
app.use('/images', serveStatic(directory), serveIndex(directory, options))
app.use('/images_temp', serveStatic(directory2), serveIndex(directory2, options))

// curl -X POST "http://protus:8085/api/upload"
api_router.post('/upload', api_controller.post_image);
test_router.get('/hello', test_controller.hello)



// Start server
var server = app.listen(port, host,  () => {
    console.log(' ### Listening on http://%s:%s', host, port);
});