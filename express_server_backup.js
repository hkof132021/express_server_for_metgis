var express = require('express');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static')
var serveIndex = require('serve-index')
var fileUpload = require('express-fileupload');
var cors = require('cors');
var fs = require('fs');




var app = express();
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));
app.use(cors());
app.use(fileUpload());



options = {
    'icons': true, 
    stylesheet : 'public/style.css'
}

//home/billchan/f4addons/hiw_chart/data
var directory_old = "/home/billchan/node_server/addon_data" // cgi server post
var directory = "/home/billchan/node_server/images"  // express server post
var port = 8085



// http://protus:8085/images
// app.use('/images', serveStatic(directory), serveIndex(directory, options))


// http://protus:8085/images_post
app.use('/images', serveStatic(directory), serveIndex(directory, options))

// http://protus:8085/hello
app.get('/hello', function(req, res){
    res.send("You just called the get method at '/hello'!\n");
 });

// curl -X POST "http://protus:8085/hello"
app.post('/hello', function(req, res){
    res.send("You just called the post method at '/hello'!\n");
});

// http://protus:8085/users/321/articles
app.get('/users/:userId/articles', function (req, res) {
    res.send('這是 user: ' + req.params.userId + ' 的文章');
})




// curl -X POST "http://protus:8085/upload"
app.post('/upload', function(req, res){
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
        console.log("img_name " + img_name)
        console.log( "img_type " + img_type)
        console.log("time_str " + time_str)
        console.log("file_name " + file_name)
        
        
        const base_path = '/home/billchan/node_server/images/' + time_str + '/' + img_type + '/'
        console.log("base_path" + base_path)

        if (!fs.existsSync(base_path)){
            fs.mkdirSync(base_path, { recursive: true });
        }

  
        // for testing purpose, txt has the base64 string
        fs.writeFile( base_path + '.txt', JSON.stringify(req.body.base64image), function(err) {
            if (err) {
                console.log(err);
            }
        });

        target_file = base_path + file_name + '.png';
        // if exist then rename
        if (fs.existsSync(target_file)) {
            console.log("Yes it is exist")
            var milliseconds = new Date().getTime();
            fs.rename(target_file, base_path + file_name + '_'+ milliseconds + '.png', function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
        }
        
        // write file
        fs.writeFile(target_file, base64Data, 'base64', function(err) {
            console.log(err);
        });
        

        console.log("Upload Done")
        return res.send(base_path);
 
    } catch (e) {
        console.log(e);
    }
    

});



  

// Start server
var server = app.listen(port, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening on http://%s:%s', host, port);
});