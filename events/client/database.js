const { database } = require("../../config/client.json")
const mongoose = require("mongoose");


module.exports = async (client) => {
    try {
        if (!database) return;
        mongoose.connect(database, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("Connected to MongoDB");
        }).catch(err => {
            console.log(err);
        })
    } catch (e) {}
}