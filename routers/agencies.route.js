
const route = require('express').Router()
const agenciesModel = require('../models/agencies.model')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const secretKey = process.env.SECRET_KEY
verifyToken = async (req, res, next) => {
    let token = req.headers.token
    if (!token) {
        res.status(404).send("access denied!")
    }
    try {
        let verif = await jwt.verify(token, secretKey)  //jwt.verify katakhd token dyalna okatchof wach howa fl7a9i9a kayn 
        next()
    } catch (err) {
        res.status(404).send(err)
    }
}

// add agency
route.post('/agencies', verifyToken, (req, res, next) => {
    agenciesModel.addAgency(req.body.name, req.body.location).then((msg) => {
        res.send(msg)
    }).catch((err) => {
        res.send(err)
    })
})

// get all agencies
route.get('/agencies', (req, res, next) => {
    agenciesModel.getAllagencies().then((doc) => {
        res.send(doc)
    }).catch((err) => {
        res.send(err)
    })
})

//get agency by id
route.get('/agencies/:id', (req, res, next) => {
    agenciesModel.getAgencyById(req.params.id).then((doc) => {
        res.send(doc)
    }).catch((err) => {
        res.send(err)
    })
})

//DELETE agency by id
route.delete('/agencies/:id', verifyToken, (req, res, next) => {
    agenciesModel.deleteOneAgency(req.params.id).then((doc) => {
        res.send(doc)
    }).catch((err) => {
        res.send(err)
    })
})

//UPDATE agency by id
route.patch('/agencies/:id', verifyToken, (req, res, next) => {
    agenciesModel.updateAgency(req.params.id, req.body.name, req.body.location).then((doc) => {
        res.send(doc)
    }).catch((err) => {
        res.send(err)
    })
})



module.exports = route