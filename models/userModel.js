const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
const errorObj = require('../errors/user')

const user = sequelize.define('Users', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    first_name: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
            isAlpha: {
                msg: errorObj.lastName.firstNameMsg,
            }
        }
    },
    last_name: {
        allowNull: true,
        type: Sequelize.STRING,
        validate: {
            isAlpha: {
                msg: errorObj.lastName.lastNameMsg,
            }
        }
    },
    email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: {
            args: true,
            msg: errorObj.email.uniqueEmailMsg
        },
        validate: {
            isEmail: {
                msg: errorObj.email.validEmailMsg
            }
        }
    },
    phone: {
        allowNull: true,
        type: Sequelize.STRING,
    },
    password: {
        allowNull: false,
        type: Sequelize.STRING,
    }
})

module.exports = user