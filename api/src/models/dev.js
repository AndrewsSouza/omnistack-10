const mongoose = require('mongoose')
const PointSchema = require('./utils/pointUtils')

const DevSchema = new mongoose.Schema({
    name: String,
    githubUsername: String,
    bio: String,
    avatarUrl: String,
    techs: [String],
    location: {
        type: PointSchema,
        index: '2dsphere',
    },
})

module.exports = mongoose.model('Dev', DevSchema)