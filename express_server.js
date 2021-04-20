var express = require('express');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static')
var serveIndex = require('serve-index')
var fileUpload = require('express-fileupload');
var cors = require('cors');
var morgan = require('morgan')
var fs = require('fs');
var app = express();
var config = require('./config');
serve_dirs(config.app.content)
// import other modules
var api_controller = require('./controller/api_controller.js');
var test_controller = require('./controller/test_controller.js');



// ---------------------------   Get env variable  -----------------

var port = config.app.port
var host = config.app.host


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

api_router.post('/upload', api_controller.post_image);
test_router.get('/hello', test_controller.hello)


function serve_dirs(content) { 
    options = {
        'icons': true, 
        stylesheet : 'public/style.css'
    }
    console.log("### Directories to be served ... --- ")
    for( key in content){
        console.log(content[key]['index'] + " : " + content[key]['path']);
        app.use(content[key]['index'], serveStatic(content[key]['path']), serveIndex(content[key]['path'], options))
    }
};

// Start server
var server = app.listen(port, host,  () => {
    console.log(' ### Listening on http://%s:%s', host, port);
});