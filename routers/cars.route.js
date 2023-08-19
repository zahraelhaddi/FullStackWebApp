
const route = require('express').Router()
const carsModel = require('../models/cars.model')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const AnnualTaxCalculator = require('../utils/tax')

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

// get cars endpoints
route.get('/cars', (req, res, next) => {
    carsModel.getAllcars().then((doc) => {
        res.json({ cars: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})

// add car endpoint
route.post('/cars', (req, res, next) => {
    const tax = AnnualTaxCalculator.AnnualTaxCalculator(req.body.puissance, req.body.carburant_id)
    carsModel.addCar(req.body.agency, req.body.model, tax, req.body.availability, req.body.matricule, req.body.ville, req.body.marque, req.body.color, req.body.categorie, req.body.carburant_id, req.body.date_immatri, req.body.puissance).then((msg) => {
        res.json({ msg: msg })
    }).catch((err) => {
        res.json({ error: err })
    })
})


//get car by id endpoint
route.get('/cars/:id', (req, res, next) => {
    carsModel.getcarById(req.params.id).then((doc) => {
        res.json({ carFound: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})

//delete car by id endpoint
route.delete('/cars/:id', verifyToken, (req, res, next) => {
    carsModel.deleteOneCar(req.params.id).then((doc) => {
        res.json({ carDeleted: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})

//update car by id endpoint
route.patch('/cars/:id', verifyToken, (req, res, next) => {
    const tax = AnnualTaxCalculator.AnnualTaxCalculator(req.body.puissance, req.body.carburant_id)
    carsModel.updateCar(req.params.id, req.body.agency, req.body.model, tax, req.body.availability, req.body.matricule, req.body.ville, req.body.marque, req.body.color, req.body.categorie, req.body.carburant_id, req.body.date_immatri, req.body.puissance).then((doc) => {
        res.json({ Carupdated: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})


//update cars tax
route.patch('/cars/tax/:id', async (req, res, next) => {
    const doc = await carsModel.getCarburantAndPuissance(req.params.id)
    let carburant_id = doc.rows[0].carburant_id
    let puissance = doc.rows[0].puissance
    const tax = AnnualTaxCalculator.AnnualTaxCalculator(puissance, carburant_id)
    carsModel.updateTax(req.params.id, tax).then((result) => {
        res.json({ updatedTax: result })
    }).catch((err) => {
        res.json({ error: err })
    })

})

route.patch('/availability/:id', (req, res, next) => {
    carsModel.changeAvailability(req.params.id, req.body.availability).then((doc) => {
        res.json({ availability: 'Availability updated successfully!' })
    }).catch((err) => {
        res.json(err)
    })
})

module.exports = route