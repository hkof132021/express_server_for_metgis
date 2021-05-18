// config.js
var dict = [];
//env_setting = 'dev'
env_setting = 'pro'
upload_dir = ''
if(env_setting == 'dev'){
    dict.push({
        index:   "/images",
        path: "/home/billchan/node_server/images"
    });
    upload_dir = '/home/billchan/node_server/images';
}
else if(env_setting == 'pro'){
    dict.push({
        index:   "/images",
        path: "/home/cfodev/workspace/express_server/images"
    });
    upload_dir = '/home/cfodev/workspace/express_server/images';

}

const config = {
    app: {
      port: 8085,
      host:'0.0.0.0',
      content : dict,
      upload_path : upload_dir
    }
   };
   
module.exports = config;