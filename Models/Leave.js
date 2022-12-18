const {model, Schema} = require('mongoose');

let Leave = new Schema({
    Guild: String,
    Channel: String,
    Msg: String,
});

module.exports = model("Leave", Leave);