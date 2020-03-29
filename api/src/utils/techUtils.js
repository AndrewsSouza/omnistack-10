module.exports = {
    parseStringAsArray: string => {
        return string.split(',').map(tech => tech.trim().toUpperCase())
    }
}