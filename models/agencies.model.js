
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

exports.getAllagencies = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM agencies;`
        client.query(query).then((result) => {
            resolve(result.rows)
        }).catch((err) => {
            resolve.json({ error: err })
        })

    })
}

exports.addAgency = (name, location) => {
    return new Promise((resolve, reject) => {
        const verifQuery = `SELECT * FROM agencies WHERE agency_name=$1 OR agency_location=$2;`;
        client.query(verifQuery, [name, location]).then((result) => {
            if (result.rows.length > 0) {
                reject("Agency already exists")
            } else {
                const query = `INSERT INTO agencies(agency_name,agency_location) VALUES($1,$2);`;
                client.query(query, [name, location]).then((msg) => {
                    resolve('Agency successfully added!')
                }).catch((err) => {
                    reject(err)
                })
            }
        }).catch((err) => {
            reject(err)
        })


    })
}

exports.getAgencyById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `select * from agencies where agency_id=$1;`
        client.query(query, [id]).then((result) => {
            if (result.rows.length > 0) {
                resolve(result.rows)
            } else {
                reject('No Agency with the Specified id')
            }
        })
    })
}

exports.deleteOneAgency = (id) => {
    return new Promise((resolve, reject) => {

        client.query(`SELECT * from agencies where agency_id=$1;`, [id]).then((result) => {
            if (result.rows.length === 1) {
                const deleteOneAgencyQuery = `DELETE from agencies where agency_id=$1;`;
                resolve(result)
                client.query(deleteOneAgencyQuery, [id])
            } else {
                reject('No agency with the id')
            }
        })


    })
}

exports.updateAgency = (id, name, loc) => {
    return new Promise((resolve, reject) => {
        const query = `update agencies set agency_name=$1,agency_location=$2 where agency_id=$3;`
        client.query(query, [name, loc, id]).then((result) => {
            resolve('updated')
        }).catch((err) => {
            reject(err)
        })

    })


}

exports.nbrAgencies = () => {
    return new Promise((resolve, reject) => {
        const query = `select count(*) from agencies;`
        client.query(query).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err)
        })

    })
}


