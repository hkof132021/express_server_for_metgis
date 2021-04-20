var fs = require('fs');

module.exports.hello = function (req, res) { 
    console.log("hello");
    res.send("hello")
};