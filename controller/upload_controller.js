var fs = require('fs');

module.exports.post_image = function (req, res) { 

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

    console.log(msg);
};