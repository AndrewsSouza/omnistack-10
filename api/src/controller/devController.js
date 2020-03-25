const axios = require('axios')
const Dev = require('../models/dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
    async index(req, res, next) {
        const devs = await Dev.find();

        return res.json(devs)
    },
    async store(req, res, next) {
        const { githubUsername, techs, latitude, longitude } = req.body

        let dev = await Dev.findOne({ githubUsername })

        if (!dev) {
            const githubApiUrl = `https://api.github.com/users/${githubUsername}`
            const response = await axios.get(githubApiUrl)

            const { name, login, avatar_url, bio } = response.data
            const techsArray = parseStringAsArray(techs)

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }

            dev = await Dev.create({
                githubUsername,
                avatarUrl: avatar_url,
                name: name ? name : login,
                bio,
                techs: techsArray,
                location,
            })

        }
        return res.json(dev)
    }
}