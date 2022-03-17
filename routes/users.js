const {Router} = require('express')
const router = Router()
const User = require('../classes/User')
const jwt = require('jsonwebtoken')
const secret ='nun54jknjnjknjun5435j3b45ji34nnbijYG67hYVTV6t67ghgvcq1hjdjwi'


router.post('/create', async (req, res) => {
    try {
        const user = await User.create(req.body.firstName, req.body.lastName, req.body.email, req.body.phone, req.body.password)
    
        res.status(201).json(user)
    } catch (e) {
        if (e.errors) {
            res.send({'error': e.errors[0].message})
        } else {
            res.send({'error': e.message})
        }
    }
})

router.get('/', async (req, res) => {
    try {
        const user = await User.getById(req.query.id)
        if (user) {
            res.send(user)
        } else  {
            const err = new Error('Error')
            res.send({'error': err})
        }
    } catch (e) {
        if (e.errors) {
            res.send({'error': e.errors[0].message})
        } else {
            res.send({'error': e.message})
        }
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.loginWith(req.body.email, req.body.password)

        if (user) {
            const accessToken = jwt.sign(user, secret)

            res.send({'accessToken': accessToken})
        }
    } catch (e) {
        if (e.errors) {
            res.send({'error': e.errors[0].message})
        } else {
            res.send({'error': e.message})
        }
    }
})

router.put('/', authenticateToken,  async (req, res) => {
    try {
        if (req.user.email === req.body.email) {
            const updatedUser = await User.update(req.query.id, req.body.firstName, req.body.lastName, req.body.email, req.body.phone, req.body.password)
            
            res.send(updatedUser)
        } else {
            res.send({'error': 'You don\'t have an access to update user'})
        }
    } catch (e) {
        if (e.errors) {
            res.send({'error': e.errors[0].message})
        } else {
            res.send({'error': e.message})
        }
    }
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.sendStatus(403)

        req.user = user
        next()
    })
}

module.exports = router