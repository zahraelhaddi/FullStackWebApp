
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

exports.getAllcars = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT
        car_id,
        c.agency_id,
        model,
        annual_tax,
        availability_status,
        matricule,
        ville,
        marque,
        color,
        categorie,
        c.carburant_id,
        date_immatri,
        puissance,
        JSON_BUILD_OBJECT('carburant_code', carb.carburant_code, 'carburant_name', carb.carburant_name) AS carburant_info,
        JSON_BUILD_OBJECT('agency_name', a.agency_name, 'agency_location', a.agency_location) AS agency_info
    FROM cars c
    JOIN agencies a ON c.agency_id = a.agency_id
    JOIN carburants carb ON c.carburant_id = carb.carburant_id;`

        client.query(query).then((result) => {
            if (result.rows.length > 0) {
                resolve(result.rows)
            } else {
                reject('no data to show')
            }
        }).catch((err) => {
            reject(err)
        })

    })
}

exports.addCar = (agency, model, tax, availability, matricule, ville, marque, color, categorie, carburant_id, date_immatri, puissance) => {
    return new Promise((resolve, reject) => {
        const verifQuery = `SELECT * FROM cars WHERE matricule=$1;`;
        client.query(verifQuery, [matricule]).then((result) => {
            if (result.rows.length > 0) {
                reject("car already exists")
            } else {
                const query = `INSERT INTO cars(agency_id,model,annual_tax,availability_status,matricule,ville,marque,color,categorie,carburant_id,date_immatri,puissance) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12);`;
                client.query(query, [agency, model, tax, availability, matricule, ville, marque, color, categorie, carburant_id, date_immatri, puissance]).then(() => {
                    resolve('successfully added CAR')
                }).catch((err) => {
                    reject(err)
                })
            }
        }).catch((err) => {
            reject(err)
        })


    })
}

exports.getcarById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT
        car_id,
        c.agency_id,
        model,
        annual_tax,
        availability_status,
        matricule,
        ville,
        marque,
        color,
        categorie,
        carburant_id,
        date_immatri,
        puissance,
        JSON_BUILD_OBJECT('carburant_code', carb.carburant_code, 'carburant_name', carb.carburant_name) AS carburant_info,
        JSON_BUILD_OBJECT('agency_name', a.agency_name, 'agency_location', a.agency_location) AS agency_info
    FROM cars c
    JOIN agencies a ON c.agency_id = a.agency_id
    JOIN carburants carb ON c.carburant_id = carb.id and car_id=$1;`
        client.query(query, [id]).then((result) => {
            if (result.rows.length > 0) {
                resolve(result.rows)
            } else {
                reject('no data to show')
            }
        }).catch((err) => {
            reject(err)
        })

    })
}

exports.deleteOneCar = (id) => {
    return new Promise((resolve, reject) => {
        client.query(`SELECT * from cars where car_id=$1;`, [id]).then((result) => {
            if (result.rows.length > 0) {
                const deleteOnecarQuery = `DELETE from cars where car_id=$1;`;
                //resolve(result)
                client.query(deleteOnecarQuery, [id]).then((result) => {
                    resolve(result)
                }).catch((err) => {
                    reject(err)
                })
            } else {
                reject('No car with the id')
            }
        }).catch((err) => {
            reject(err)
        })


    })
}

exports.updateCar = (id, agency, model, tax, availability, matricule, ville, marque, color, categorie, carburant_id, date_immatri, puissance) => {
    return new Promise((resolve, reject) => {
        const verifquery = `SELECT * FROM cars WHERE car_id = $1;`;
        client.query(verifquery, [id]).then((resu) => {
            if (resu.rows.length > 0) {
                const query = `
                    UPDATE cars
                    SET agency_id = $1, model = $2, annual_tax = $3, availability_status = $4, , matricule=$5, ville=$6, marque=$7, color=$8, categorie=$9, carburant_id=$10, date_immatri=$11, puissance=$12
                    WHERE car_id = $5;
                `;
                client.query(query, [agency, model, tax, availability, matricule, ville, marque, color, categorie, carburant_id, date_immatri, puissance, id]).then(() => {
                    resolve('updated');
                }).catch((err) => {
                    reject(err);
                });
            } else {
                reject('no car with the specified id');
            }
        }).catch((err) => {
            reject(err);
        });
    });
}

exports.getCarburantAndPuissance = (id) => {
    return new Promise((resolve, reject) => {
        const query = `select carburant_id,puissance from cars where car_id=$1;`
        client.query(query, [id]).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err)
        })
    })

}

exports.updateTax = (id, tax) => {
    return new Promise((resolve, reject) => {
        const query = `update cars set annual_tax=$1 where car_id=$2;`
        client.query(query, [tax, id]).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err)
        })
    })
}

// exports.updateCarAfterTransfer = (car_id, source_agency, new_source_agency) => {
//     return new Promise((resolve, reject) => {
//         const query = `update cars set availability_status=$1, agency_id=$2 where car_id=$3;`

//         const verifquery = `select source_agency_id,destination_agency_id from transfers where source_agency_id=$1 AND destination_agency_id=$2 AND car_id=$3;`
//         client.query(verifquery, [new_source_agency, source_agency, car_id]).then((doc) => {
//             if (doc.rows[0]) {
//                 client.query(query, ["true", new_source_agency, car_id]).then((result) => {
//                     resolve(result)
//                 }).catch((err) => {
//                     reject(err)
//                 })
//             } else {
//                 client.query(query, ["false", new_source_agency, car_id]).then((result) => {
//                     resolve(result)
//                 }).catch((err) => {
//                     reject(err)
//                 })
//             }
//         })
//     })
// }


exports.updateCarAfterTransfer = (car_id, new_availability_status, new_source_agency) => {
    return new Promise((resolve, reject) => {
        const query = `update cars set availability_status=$1, agency_id=$2 where car_id=$3;`
        client.query(query, [new_availability_status, new_source_agency, car_id]).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err)
        })
    })
}


exports.verifCarAvailability = (id) => {
    return new Promise((resolve, reject) => {
        const availabilityVerif = `select availability_status from cars where car_id=$1;`
        client.query(availabilityVerif, [id]).then((doc) => {
            if (!doc) {
                reject(doc)
            } else {
                resolve(doc)
            }
        }).catch((err) => {
            reject(err)
        })
    })

}