
const route = require('express').Router()
const agenciesModel = require('../models/agencies.model')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const secretKey = process.env.SECRET_KEY
verifyToken = async (req, res, next) => {
    let token = req.headers.token
    if (!token) {
        res.status(404).json("access denied!")
    }
    try {
        let verif = await jwt.verify(token, secretKey)  //jwt.verify katakhd token dyalna okatchof wach howa fl7a9i9a kayn 
        next()
    } catch (err) {
        res.status(404).json(err)
    }
}

// add agency
route.post('/agencies', verifyToken, (req, res, next) => {
    agenciesModel.addAgency(req.body.agency_name, req.body.agency_location).then((msg) => {
        res.json({ msg: msg })
    }).catch((err) => {
        res.json({ error: err })
    })
})

// get all agencies
route.get('/agencies', verifyToken, (req, res, next) => {
    agenciesModel.getAllagencies().then((doc) => {
        res.json(doc)
    }).catch((err) => {
        res.json(err)
    })
})

//get agency by id
route.get('/agencies/:id', verifyToken, (req, res, next) => {
    agenciesModel.getAgencyById(req.params.id).then((doc) => {
        res.json(doc)
    }).catch((err) => {
        res.json(err)
    })
})

//DELETE agency by id
route.delete('/agencies/:id', verifyToken, (req, res, next) => {
    agenciesModel.deleteOneAgency(req.params.id).then((doc) => {
        res.json({ msg: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})

//UPDATE agency by id
route.patch('/agencies/:agency_id', verifyToken, (req, res, next) => {
    console.log(req.params)
    agenciesModel.updateAgency(req.params.agency_id, req.body.agency_name, req.body.agency_location).then((doc) => {
        res.json({ msg: doc })
    }).catch((err) => {
        res.json({ msg: err })
    })
})



module.exports = route