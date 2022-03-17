const express = require('express')
const app = express()
const sequelize = require('./utils/database')
const bodyParser = require('body-parser')

//Routes
const usersRoute = require('./routes/users')

const PORT = process.env.PORT || 80

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', usersRoute)

async function start() {
    try {
        await sequelize.sync()
        
        app.listen(PORT, () => {
            console.log('Server is running on port: ' + PORT);
        })
    } catch (e) {
        console.log(e)
    }
}

start()