// config.js
var dict = [];
//env_setting = 'dev'
env_setting = 'pro'

if(env_setting == 'dev'){
    dict.push({
        index:   "/images",
        path: "/home/billchan/node_server/images"
    });
    dict.push({
        index:   "/images_temp",
        path: "/home/billchan/node_server/addon_data"
    });
}
else if(env_setting == 'pro'){
    dict.push({
        index:   "/images",
        path: "/home/cfodev/workspace/express_server/images"

    });
}
const config = {
    app: {
      port: 8085,
      host:'0.0.0.0',
      content : dict
    }
   };
   
module.exports = config;