const techUtils = require('../utils/techUtils')
const Dev = require('../models/dev')

module.exports = {
    async index(req, res, next) {
        const { techs, latitude, longitude } = req.query
        const techsArray = !!techs ? techUtils.parseStringAsArray(techs) : []

        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000,
                }
            }
        })

        return res.json({ devs })
    }
}