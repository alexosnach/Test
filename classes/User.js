const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const errorObj = require('../errors/user')
const io = require('socket.io')(3000, {
    cors: {
        origin: ["http://localhost:80"]
    }
})

class User {
    static create(firstName, lastName, email, phone, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await userModel.create({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    password: bcrypt.hashSync(password, 10) 
                })

                resolve(user)
            } catch (e) {
                reject(e)
            }
        })
    }

    static getById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await userModel.findByPk(+id)

                resolve(user)
            } catch (e) {
                reject(e)
            }
        })
    }

    static getByEmail(email) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await userModel.findAll({
                    where: {
                        email: email
                    }
                })

                if (users.length > 0) {
                    resolve(users[0])
                } else {
                    console.log('in here');
                    const err = new Error(errorObj.email.cantFindByEmailMsg)
                    reject(err)
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    static loginWith(email, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.getByEmail(email)

                if (await bcrypt.compare(password, user.password)) {
                    resolve(this.convertToPlainObj(user))
                } else {
                    const err = new Error(errorObj.email.incorrectPasswordMsg)
                    reject(err)
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    static update(id, firstName, lastName, email, phone, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await userModel.findAll({
                    where: {
                        id: id
                    }
                })

                if (users.length > 0) {
                    users[0].first_name = firstName
                    users[0].last_name = lastName
                    users[0].email = email
                    users[0].phone = phone
                    users[0].password = password
                    users[0].save()

                    this.sendSocketWithUser(users[0])
    
                    resolve(users[0])
                } else {
                    const err = new Error(errorObj.email.cantFindByEmailMsg)
                    reject(err)
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    static convertToPlainObj(response) {
        return {
            id: response.id,
            first_name: response.first_name,
            last_name: response.last_name,
            email: response.email,
            phone: response.phone,
            password: response.password
        }
    }

    static sendSocketWithUser(user) {
        io.on('connection', socket => {
            socket.broadcust.emit('user-updated', user)
        })
    }
}

module.exports = User