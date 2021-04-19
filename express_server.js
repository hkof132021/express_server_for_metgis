var express = require('express');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static')
var serveIndex = require('serve-index')
var fileUpload = require('express-fileupload');
var cors = require('cors');
var fs = require('fs');
var app = express();
var dotenv = require('dotenv')


// ---------------------------   Get env variable  -----------------
const envConfig = dotenv.parse(fs.readFileSync('.env'))
var port = envConfig['port']
var host = envConfig['host']

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

// curl -X POST "http://protus:8085/upload"
api_router.post('/upload', function(req, res){
    console.log("uploading image.............................")
    try {
        // // to convert base64 format into random filename
        var base64Data = req.body.base64image.replace(/^data:image\/png;base64,/, "");
        var img_name = req.body.file_name;
        var img_type = req.body.file_type;
        var time_str  = img_name.split('.')[0];
        if(time_str == ""){
            time_str = img_name
        }
        var file_name = img_type+ '_' + img_name;

        console.log("####################################")
        console.log("img_name : " + img_name)
        console.log( "img_type : " + img_type)
        console.log("time_str : " + time_str)
        console.log("file_name : " + file_name)
        
        const base_path = '/home/billchan/node_server/images/' + time_str + '/' + img_type + '/'
        console.log("base_path " + base_path)

        if (!fs.existsSync(base_path)){
            fs.mkdirSync(base_path, { recursive: true });
        }

        // for testing purpose, txt has the base64 string
        fs.writeFile( base_path + '.txt', JSON.stringify(req.body.base64image), function(err) {
            if(err){
                console.log(err);
            }
        });

        target_file = base_path + file_name + '.png';
        // if exist then rename
        if (fs.existsSync(target_file)) {
            var milliseconds = new Date().getTime();
            new_name = base_path + file_name + '_'+ milliseconds + '.png'
            fs.rename(target_file, new_name, function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
            console.log(　"### " + target_file +　" exist, already rename to " + new_name)
        }
        
        // write file
        fs.writeFile(target_file, base64Data, 'base64', function(err) {
            console.log(err);
        });
        console.log("Upload Done")
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({"base_path":base_path}));
    } catch (e) {
        console.log(e);
    }
});


// Start server
var server = app.listen(port, host,  () => {
    console.log(' ### Listening on http://%s:%s', host, port);
});