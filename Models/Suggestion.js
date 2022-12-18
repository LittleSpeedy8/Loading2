const {model, Schema} = require('mongoose');

let Suggestion = new Schema({
    GuildID: String,
    MessageID: String,
    User: String,
    Details: Array
});

module.exports = model("Suggestion", Suggestion);