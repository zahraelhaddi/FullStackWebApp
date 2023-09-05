
const route = require('express').Router()
const usersModel = require('../models/users.model')
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv").config()


const secretKey = process.env.SECRET_KEY
verifyToken = async (req, res, next) => {
    let token = req.headers.token;
    if (!token) {
        return res.status(401).json("Access denied!"); // 401 Unauthorized
    }

    try {
        let verif = await jwt.verify(token, secretKey);
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(403).json(err); // 403 Forbidden
    }
};

//const specificAdminUsername = process.env.USERNAME_ADMIN;
// verifyTokenAdmin = (req, res, next) => {
//     let token = req.headers.token;
//     if (!token) {
//         return res.status(401).json("Access denied!"); // 401 Unauthorized
//     }

//     try {
//         let decodedToken = jwt.verify(token, secretKey);
//         if (decodedToken.username === specificAdminUsername) {
//             next(); // Proceed to the next middleware or route handler
//         } else {
//             res.status(403).json("Unauthorized"); // 403 Forbidden
//         }
//     } catch (err) {
//         res.status(403).json(err); // 403 Forbidden
//     }
// };

verifyTokenAdmin = (req, res, next) => {
    let token = req.headers.token;
    if (!token) {
        return res.status(401).json("Access denied!"); // 401 Unauthorized
    }

    try {
        let decodedToken = jwt.verify(token, secretKey);
        if (decodedToken.role === process.env.ROLE) {
            next(); // Proceed to the next middleware or route handler
        } else {
            res.status(403).json("Unauthorized"); // 403 Forbidden
        }
    } catch (err) {
        res.status(403).json(err); // 403 Forbidden
    }
};




route.post('/users/add', verifyTokenAdmin, (req, res, next) => {
    usersModel.register(req.body.fullname, req.body.email, req.body.agency, req.body.password).then((msg) => {
        res.json(msg)
    }).catch((err) => {
        res.json(err)
    })
})

route.post('/admin/login', (req, res, next) => {
    usersModel.login(req.body.email, req.body.password).then((doc) => {
        res.json(doc)
    }).catch((err) => {
        res.json(err)
    })
})

route.get('/users', verifyToken, (req, res, next) => {
    usersModel.getAllUsers().then((users) => {
        res.json(users)
    }).catch((err) => {
        res.status(500).json(err)
    })
})




route.get('/users/:id', verifyToken, (req, res, next) => {
    usersModel.getOneUser(req.params.id).then((doc) => {
        res.json(doc.rows[0])
    }).catch((err) => {
        res.json(err)
    })
})

route.delete('/users/:id', verifyToken, (req, res, next) => {
    usersModel.deleteOneUser(req.params.id).then((doc) => {
        res.json(doc)
    }).catch((err) => {
        res.json(err)
    })
})

route.patch('/users/:user_id', verifyToken, (req, res, next) => {
    usersModel.updateUser(req.params.user_id, req.body.fullname, req.body.email).then((doc) => {
        res.json({ msg: doc })
    }).catch((err) => {
        res.json(err)
    })
})

route.get('/c/:id', (req, res, next) => {
    usersModel.getagencyidfromuserid(req.params.id).then((doc) => {
        res.json(doc.rows[0].agency_id)
    }).catch((err) => {
        res.json(err)
    })
})







module.exports = route