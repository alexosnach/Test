const Sequelize = require('sequelize')
const keys = require('../keys/index')

const sequelize = new Sequelize(keys.DB_NAME, keys.DB_USER_NAME, keys.DB_PASSWORD, {
    host: keys.DB_HOST,
    dialect: 'postgres'
})

module.exports = sequelize