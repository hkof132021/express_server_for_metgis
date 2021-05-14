var fs = require('fs');
var config = require('../config');
var upload_path = config.app.upload_path;





module.exports.post_image = function (req, res) { 

    try {
        // // to convert base64 format into random filename
        var base64Data = req.body.base64image.replace(/^data:image\/png;base64,/, "");
        var img_name = req.body.file_name;
        var img_type = req.body.file_type;
        var kml_file = req.body.kmlstr;
        
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
        
        const base_path = upload_path + '/' + time_str + '/' + img_type + '/'
        const kml_base_path = upload_path + '/kml/'
        console.log("base_path " + base_path)

        if (!fs.existsSync(base_path)){
            fs.mkdirSync(base_path, { recursive: true });
        }

        if (!fs.existsSync(kml_base_path)){
            fs.mkdirSync(kml_base_path, { recursive: true });
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
            console.log(　"### " + target_file +　" already exist,  rename to " + new_name)
        }
        
        // write file
        fs.writeFile(target_file, base64Data, 'base64', function(err) {
            console.log(err);
        });




        console.log(kml_file)
        fs.writeFile(kml_base_path + file_name + ".kml", kml_file,  function(err) {
            console.log(err);
        });


        console.log("Upload Done")
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            "base_path":base_path,
            "img_name" :img_name,
            "img_type" :img_type,
            "time_str" :time_str,
            "file_name": file_name
        }));
        return res
    } catch (e) {
        console.log(e);
    }

};



module.exports.check_image_exist = function (req, res) { 

    try {

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
        
        const base_path = upload_path + '/' + time_str + '/' + img_type + '/'
        console.log("base_path " + base_path)

        target_file = base_path + file_name + '.png';
        // if exist then rename
        if (fs.existsSync(target_file)) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                "isExist": "true"
            }));
        }
        else{
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                "isExist": "false"
            }));
        }
        
        return res
    } catch (e) {
        console.log(e);
    }

};