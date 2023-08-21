
const route = require('express').Router()
const transfersModel = require('../models/transfers.model')
const carsModel = require('../models/cars.model')

route.get('/transfers', (req, res, next) => {
    transfersModel.getAllTransfers().then((doc) => {
        res.json({ transfers: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})

// route.post('/transfers', (req, res, next) => {
//     carsModel.verifCarAvailability(req.body.car_id).then((doc) => {
//         if (doc.rows[0].availability_status === true) {
//             transfersModel.addTransfer(req.body.car_id, req.body.source, req.body.destination, req.body.user_id).then((doc) => {
//                 carsModel.updateCarAfterTransfer(req.body.car_id, req.body.source, req.body.destination).then((result) => {
//                     res.json({ carUpdatedAfterTransfer: result })
//                 }).catch((err) => {
//                     res.json({ error: err })
//                 })
//                 res.json({ transferAdded: doc })
//             }).catch((err) => {
//                 res.json({ error: err })
//             })
//         } else {
//             res.json({ msg: 'car not available for transfer, it is already transfered!!' })
//         }
//     }).catch((err) => {
//         res.json({ errorr: err })
//     })

// })

route.post('/transfers', (req, res, next) => {
    carsModel.verifCarExist(req.body.car_id).then((doc) => {
        carsModel.verifCarAvailability(req.body.car_id).then((doc) => {
            if (doc.rows[0].availability_status === true) {
                transfersModel.addTransfer(req.body.car_id, req.body.source, req.body.destination, req.body.user_id).then((doc) => {
                    carsModel.updateCarAfterTransfer(req.body.car_id, false, req.body.destination).then((result) => {
                        res.json({ carUpdatedAfterTransfer: result })
                    }).catch((err) => {
                        res.json({ error: err })
                    })
                    res.json({ transferAdded: doc })
                }).catch((err) => {
                    res.json({ error: err })
                })
            } else {
                res.json({ msg: 'car not available for transfer, it is already transfered!!' })
            }
        }).catch((err) => {
            res.json({ errorr: err })
        })
    }).catch((err) => {
        res.json({ error: err })
    })





})

route.get('/transfers/:id', (req, res, next) => {
    transfersModel.getTransferById(req.params.id).then((doc) => {
        res.json({ transfer: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})

route.delete('/transfers/:id', (req, res, next) => {
    transfersModel.deleteOneTransfer(req.params.id).then((doc) => {
        res.json({ transferDeleted: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})

route.patch('/transfers/:id', (req, res, next) => {
    transfersModel.updateTransfer(req.params.id, req.body.car_id, req.body.source, req.body.destination).then((doc) => {
        carsModel.updateCarAfterTransfer(req.body.car_id, false, req.body.destination).then((result) => {
            res.json({ carUpdatedAfterTransfer: result })
        }).catch((err) => {
            res.json({ error: err })
        })
        //res.json({ transferUpdated: doc })
    }).catch((err) => {
        res.json({ error: err })
    })
})

route.get('/transfers/user/:id', (req, res, next) => {
    transfersModel.getUserTransfers(req.params.id).then((result) => {
        res.json({ userTransfers: result })
    }).catch((err) => {
        res.json({ error: err })
    })
})





module.exports = route