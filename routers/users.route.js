
const route = require('express').Router()
const usersModel = require('../models/users.model')
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv").config()


const secretKey = process.env.SECRET_KEY
verifyToken = async (req, res, next) => {
    let token = req.headers.token
    if (!token) {
        res.status(404).json({ msg: "access denied!" })
    }
    try {
        let verif = await jwt.verify(token, secretKey)  //jwt.verify katakhd token dyalna okatchof wach howa fl7a9i9a kayn 
        next()
    } catch (err) {
        res.status(404).json({ msg: err })
    }
}


route.post('/register', (req, res, next) => {
    usersModel.register(req.body.fullname, req.body.email, req.body.agency, req.body.password).then((msg) => {
        res.json({ message: msg })
    }).catch((err) => {
        res.json({ error: err })
    })
})

route.post('/login', (req, res, next) => {
    usersModel.login(req.body.email, req.body.password).then((doc) => {
        res.json({ token: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})

route.get('/users', verifyToken, (req, res, next) => {
    usersModel.getAllUsers().then((users) => {
        res.json({ users: users })
    }).catch((err) => {
        res.json({ error: err })
    })
})

route.get('/users/:id', verifyToken, (req, res, next) => {
    usersModel.getOneUser(req.params.id).then((doc) => {
        res.json({ user: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})

route.delete('/users/:id', verifyToken, (req, res, next) => {
    usersModel.deleteOneUser(req.params.id).then((doc) => {
        res.json({ deleted: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})

route.patch('/users/:id', verifyToken, (req, res, next) => {
    usersModel.updateUser(req.params.id, req.body.fullname, req.body.email, req.body.agency, req.body.password).then((doc) => {
        res.json({ updatedUser: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})





module.exports = route