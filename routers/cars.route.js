
const route = require('express').Router()
const carsModel = require('../models/cars.model')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const AnnualTaxCalculator = require('../utils/tax')

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

// get all cars endpoints
route.get('/cars', verifyToken, (req, res, next) => {
    carsModel.getAllcars().then((doc) => {
        res.json(doc)
    }).catch((err) => {
        res.json({ error: err })
    })
})

// add car endpoint
route.post('/cars', verifyToken, (req, res, next) => {
    const tax = AnnualTaxCalculator.AnnualTaxCalculator(req.body.puissance, req.body.carburant_id)
    carsModel.addCar(req.body.agency_id, req.body.model, tax, true, req.body.matricule, req.body.ville, req.body.marque, req.body.color, req.body.categorie, req.body.carburant_id, req.body.date_immatri, req.body.puissance).then((msg) => {
        res.json({ msg: msg })
    }).catch((err) => {
        res.json({ msg: err })
    })
})



//get cars by agency_id
route.get('/cars/agency/:id', (req, res, next) => {
    carsModel.getcarsByAgency(req.params.id).then((doc) => {
        res.json(doc.rows)
    }).catch((err) => {
        res.json(err)
    })
})

//get car by id endpoint
route.get('/cars/:id', verifyToken, (req, res, next) => {
    carsModel.getcarById(req.params.id).then((doc) => {
        res.json(doc[0])
    }).catch((err) => {
        res.json({ msg: err })
    })
})

//delete car by id endpoint
route.delete('/cars/:id', verifyToken, (req, res, next) => {
    carsModel.deleteOneCar(req.params.id).then((doc) => {
        res.json({ msg: doc })
    }).catch((err) => {
        res.json({ msg: err })
    })
})

//update car by id endpoint
route.patch('/cars/:id', verifyToken, async (req, res, next) => {
    try {
        const tax = await AnnualTaxCalculator.AnnualTaxCalculator(req.body.puissance, req.body.carburant_id);
        const result = await carsModel.updateCar(req.params.id, req.body.agency_id, req.body.model, tax, true, req.body.matricule, req.body.ville, req.body.marque, req.body.color, req.body.categorie, req.body.carburant_id, req.body.date_immatri, req.body.puissance);
        res.json({ msg: result });
    } catch (error) {
        res.json({ error: error.message });
    }
});



//update a car's tax(if null)
route.patch('/cars/tax/:id', verifyToken, async (req, res, next) => {
    const doc = await carsModel.getCarburantAndPuissance(req.params.id)
    let carburant_id = doc.rows[0].carburant_id
    let puissance = doc.rows[0].puissance
    const tax = AnnualTaxCalculator.AnnualTaxCalculator(puissance, carburant_id)
    carsModel.updateTax(req.params.id, tax).then((result) => {
        res.send(result)
    }).catch((err) => {
        res.send(err)
    })

})


//update a car's avalability_status
route.patch('/cars/availability/:id', verifyToken, (req, res, next) => {

    carsModel.changeAvailability(req.params.id, req.body.availability)
        .then((doc) => {
            //console.log("updated : " + doc)
            // res.send({teset})
            res.json({ result: 'Availability updated successfully!' })
        }).catch((err) => {
            res.send(err)
        })

})


route.get("/cars/agency/avnbr/:id", (req, res, next) => {

    carsModel.availablecarsnb(req.params.id)
        .then((doc) => {
            res.json(doc)
        }).catch((err) => {
            res.json(err)
        })
})

route.get("/cars/agency/unavnbr/:id", (req, res, next) => {

    carsModel.unavailablecarsnb(req.params.id)
        .then((doc) => {
            res.json(doc)
        }).catch((err) => {
            res.json(err)
        })
})

route.get("/cars/agency/nbr/:id", (req, res, next) => {
    carsModel.totalCarsByAgency(req.params.id)
        .then((doc) => {
            res.json(doc.rows[0].count)
        }).catch((err) => {
            res.json(err)
        })
})


module.exports = route