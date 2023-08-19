
const route = require('express').Router()
const agenciesModel = require('../models/agencies.model')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

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

// add ahgggjl
route.post('/agencies', verifyToken, (req, res, next) => {
    agenciesModel.addAgency(req.body.name, req.body.location).then((msg) => {
        res.json({ msg: msg })
    }).catch((err) => {
        res.json({ error: err })
    })
})

// jfjkn
route.get('/agencies', (req, res, next) => {
    agenciesModel.getAllagencies().then((doc) => {
        res.json({ agencies: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})

route.get('/agencies/:id', (req, res, next) => {
    agenciesModel.getAgencyById(req.params.id).then((doc) => {
        res.json({ agencyFound: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})

route.delete('/agencies/:id', verifyToken, (req, res, next) => {
    agenciesModel.deleteOneAgency(req.params.id).then((doc) => {
        res.json({ agencyDeleted: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})

route.patch('/agencies/:id', verifyToken, (req, res, next) => {
    agenciesModel.updateAgency(req.params.id, req.body.name, req.body.location).then((doc) => {
        res.json({ agencyupdated: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})



module.exports = route