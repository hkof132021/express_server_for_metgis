// config.js
const env = process.env.NODE_ENV; // 'dev' or 'test'

const dev = {
 app: {
    port: parseInt(process.env.DEV_APP_PORT) || 8085,
    host: '0.0.0.0'
 },
 db: {
   host: process.env.DEV_DB_HOST || 'localhost',
   port: parseInt(process.env.DEV_DB_PORT) || 27017,
   name: process.env.DEV_DB_NAME || 'db'
 },
 path:{
    directory2 : "/home/billchan/node_server/addon_data",
    directory :"/home/billchan/node_server/images"
 }
};
const test = {
 app: {
   port: parseInt(process.env.TEST_APP_PORT) || 3000
 },
 db: {
   host: process.env.TEST_DB_HOST || 'localhost',
   port: parseInt(process.env.TEST_DB_PORT) || 27017,
   name: process.env.TEST_DB_NAME || 'test'
 },
 path:{
    directory2 : "/home/billchan/node_server/addon_data",
    directory :"/home/billchan/node_server/images"
 }
};

const config = {
 dev,
 test
};

module.exports = config[env];