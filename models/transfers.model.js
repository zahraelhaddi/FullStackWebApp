
const { Client } = require('pg')
const dotenv = require("dotenv").config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

var pwd = process.env.PASSWORD

//PostgreSQL Database Connection 
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: pwd,
    port: 5432,
})

client.connect()

exports.getAllTransfers = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT
        t.transfer_id,
        JSON_BUILD_OBJECT(
            'user_id', u.user_id,
            'fullname', u.fullname,
            'email', u.email
        ) AS user_info,
        JSON_BUILD_OBJECT(
            'agency_id', src_agency.agency_id,
            'agency_name', src_agency.agency_name,
            'agency_location', src_agency.agency_location
        ) AS source_agency,
        JSON_BUILD_OBJECT(
            'agency_id', dest_agency.agency_id,
            'agency_name', dest_agency.agency_name,
            'agency_location', dest_agency.agency_location
        ) AS destination_agency,
        JSON_BUILD_OBJECT(
            'car_id', c.car_id,
            'model', c.model,
            'annual_tax', c.annual_tax
        ) AS car,
        t.transfer_date
    FROM transfers t
    JOIN agencies src_agency ON t.source_agency_id = src_agency.agency_id
    JOIN agencies dest_agency ON t.destination_agency_id = dest_agency.agency_id
    JOIN cars c ON t.car_id = c.car_id
    JOIN users u ON t.user_id = u.user_id;`
        client.query(query).then((result) => {
            if (result.rows.length > 0) {
                resolve(result.rows)
            } else {
                reject('No transfers to show')
            }
        }).catch((err) => {
            reject(err)
        })
    })
}

exports.addTransfer = (car_id, source, destination, user_id) => {
    return new Promise((resolve, reject) => {
        const query = `insert into transfers(car_id,source_agency_id,destination_agency_id,user_id) values($1,$2,$3,$4) ;`
        client.query(query, [car_id, source, destination, user_id]).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err)
        })
    }).catch((err) => {
        reject(err)
    })
}


exports.getTransferById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `select * from transfers where transfer_id=$1;`
        client.query(query, [id]).then((result) => {
            if (result.rows.length > 0) {
                resolve(result.rows)
            } else {
                reject('No transfer with the specified id')
            }
        }).catch((err) => {
            reject(err)
        })
    })
}

exports.deleteOneTransfer = (id) => {
    return new Promise((resolve, reject) => {

        client.query(`SELECT * from transfers where transfer_id=$1;`, [id]).then((result) => {
            if (result.rows.length === 1) {
                const deleteOneAgencyQuery = `DELETE from transfers where transfer_id=$1;`;
                resolve(result.rows)
                client.query(deleteOneAgencyQuery, [id])
            } else {
                reject('No transfer with the id')
            }
        })


    })
}

exports.updateTransfer = (id, car_id, source, destination,) => {
    return new Promise((resolve, reject) => {
        const verifquery = `select * from transfers where transfer_id=$1;`
        client.query(verifquery, [id]).then((resu) => {
            if (resu.rows.length > 0) {
                resolve(resu.rows)
                const query = `update transfers set car_id=$1,source_agency_id=$2 ,destination_agency_id=$3 where transfer_id=$4;`
                client.query(query, [car_id, source, destination, id]).then((result) => {
                    resolve('updated')
                }).catch((err) => {
                    reject(err)
                })
            } else {
                reject('no transfer with the specified id')
            }
        })

    })
}


exports.getUserTransfers = (id) => {
    return new Promise((resolve, reject) => {
        const query = `select *from transfers where user_id=$1; `
        client.query(query, [id]).then((doc) => {
            resolve(doc.rows)
        }).catch((err) => {
            reject(err)
        })
    })
}
