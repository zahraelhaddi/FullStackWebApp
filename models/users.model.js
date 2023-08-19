//const joi = require('joi')
//const { Sequelize } = require("sequelize")
const { Client } = require('pg')
const dotenv = require("dotenv").config()
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')

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


exports.register = (fullname, email, agency, password) => {
    return new Promise(async (resolve, reject) => {

        const emailExistsQuery=`SELECT *FROM users WHERE email=$1;`;
        const emailExistsResult= client.query(emailExistsQuery,[email]);
        if((await emailExistsResult).rows.length>0){
            reject("Already registered")
        }else{
            let hashedPassword = await bcrypt.hash(password, 10)
            const query = `
            INSERT INTO users (fullname, email, agency_id, password_hash)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

            client.query(query, [fullname, email, agency, hashedPassword], (err, result) => {
                if (err) {
                    reject("Not inserted")
                } else {
                   resolve(result.rows[0])
            }
        })
        }
        
    })
}

const secretKey = process.env.SECRET_KEY

exports.login=(email,password)=>{
    return new Promise((resolve,reject)=>{
        const emailExistsQuery=`SELECT *FROM users WHERE email=$1;`;
        client.query(emailExistsQuery,[email]).then((result)=>{
            if(result.rows.length===0){
                reject("Not Registered")
            }else{
                let foundPasssword = result.rows[0].password_hash
                bcrypt.compare(password, foundPasssword).then((same)=>{
                if(same==true){
                    let token = jwt.sign({ user_id: result.rows[0].user_id, username: result.rows[0].fullname }, secretKey)
                    resolve(token)
                }else{
                    reject('password incorrect')
                }
            }).catch((err)=>{
                reject(err)
            })
            }
        }).catch((err)=>{
            reject(err)
        })
       
    })
}

exports.getAllUsers=()=>{
    return new Promise((resolve,reject)=>{
        const getAllUsersQuery="SELECT user_id, fullname, email, u.agency_id,JSON_BUILD_OBJECT('agency_name', a.agency_name,'agency_location', a.agency_location) AS agency_info FROM users u JOIN agencies a ON u.agency_id = a.agency_id;";
        client.query(getAllUsersQuery).then((result)=>{
        if(result.rows.length>0){
            resolve(result.rows)
        }else{
            reject('no users')
        }
    }).catch((err)=>{
        reject(err)
    })
    })
    
}

exports.getOneUser=(id)=>{
    const getOneUserQuery=`SELECT * FROM users WHERE user_id=$1;`;
    return client.query(getOneUserQuery,[id]);
}

exports.deleteOneUser=(id)=>{
    return new Promise((resolve,reject)=>{
        
        client.query(`SELECT * from users where user_id=$1;`,[id]).then((result)=>{
            if(result.rows.length===1){
                const deleteOneUserQuery= `DELETE from users where user_id=$1;`;
                resolve(result)
                client.query(deleteOneUserQuery,[id])
                
            }else{
                reject('No user with the id')
            }
        })
        
           
        })
}

exports.updateUser=(id,fn,email,agency,password)=>{
    return new Promise((resolve, reject) => {
        const verifquery = `select * from users where user_id=$1;`
        client.query(verifquery, [id]).then(async(resu) => {
            if (resu.rows.length > 0) {
                resolve(resu.rows)
                const query = `update users set fullname=$1,email=$2, agency_id=$3,password_hash=$4 where user_id=$5;`
                const  hashedpass= await bcrypt.hash(password,10)
                client.query(query, [fn,email,agency, hashedpass,id]).then((result) => {
                    resolve('updated')
                }).catch((err) => {
                    reject(err)
                })
            } else {
                reject('no user with the specified id')
            }
        })

    })
}

// exports.getUserById=(id)=>{
//     return new Promise((resolve,reject)=>{
//         const getUserbyIdQuery= `SELECT * from users where id=$1;`
//         client.query('getUserbyIdQuery',[id]).then((result)=>{
//             if(result.rows.length===1){
//                 resolve(result)
//             }else{
//                 reject(`No user with the ID : ${id}`)
//             }
//         })
//     })
// }
// exports.login=(email,password)=>{
//     return new Promise((resolve,reject)=>{
//         const query=`SELECT * FROM users WHERE email=$`
//     })
// }

// exports.getLoginPage=()=>{
//     return new Promise((resolve,reject)=>{
        
//     })
// }