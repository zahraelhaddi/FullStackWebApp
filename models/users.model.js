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


exports.register = (fullname, email, agency, password,role) => {
    return new Promise(async (resolve, reject) => {

        const emailExistsQuery=`SELECT user_id,fullname,email,agency_id,password_hash FROM users WHERE email=$1;`;
        const emailExistsResult= client.query(emailExistsQuery,[email]);
        if((await emailExistsResult).rows.length>0){
            reject("Agent existe déjà!")
        }else{
            let hashedPassword = await bcrypt.hash(password, 10)
            const query = `
            INSERT INTO users (fullname, email, agency_id, password_hash,role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

            client.query(query, [fullname, email, agency, hashedPassword,role], (err, result) => {
                if (err) {
                    reject("Not inserted")
                } else {
                   resolve("nouveau Agent ajoutée avec succès!")
            }
        })
        }
        
    })
}

const secretKey = process.env.SECRET_KEY

// exports.login=(email,password)=>{
//     return new Promise((resolve,reject)=>{
//         const emailExistsQuery=`SELECT *FROM users WHERE email=$1;`;
//         client.query(emailExistsQuery,[email]).then((result)=>{
//             if(result.rows.length===0){
//                 reject("Email ou password invalide")
//             }else{
//                 let foundPasssword = result.rows[0].password_hash
//                 bcrypt.compare(password, foundPasssword).then((same)=>{
//                 if(same==true){
//                     let token = jwt.sign({ user_id: result.rows[0].user_id, username: result.rows[0].fullname,role:'Admin' }, secretKey,{expiresIn:'1d'})
//                     resolve({token:token,username:result.rows[0].fullname,role:'admin'})
//                 }else{
//                     reject('Email ou password invalide')
//                 }
//             }).catch((err)=>{
//                 reject(err)
//             })
//             }
//         }).catch((err)=>{
//             reject(err)
//         })
       
//     })
// }


exports.login = (email, password) => {
    return new Promise((resolve, reject) => {
        const emailExistsQuery = `SELECT * FROM users WHERE email = $1;`;
        client.query(emailExistsQuery, [email]).then((result) => {
            if (result.rows.length === 0) {
                reject("Email ou password invalide");
            } else {
                let foundPassword = result.rows[0].password_hash;
                bcrypt.compare(password, foundPassword).then((same) => {
                    if (same == true) {
                        // let token = jwt.sign(
                        //     {
                        //         user_id: result.rows[0].user_id,
                        //         username: result.rows[0].fullname,
                        //         role: 'Admin'
                        //     },
                        //     secretKey,
                        //     { expiresIn: '100d' }
                        // );
                        let role = result.rows[0].role; // Get the user's role from the database
                        let token = jwt.sign(
                            {
                                user_id: result.rows[0].user_id,
                                username: result.rows[0].fullname,
                                role: role // Include the user's role in the token
                            },
                            secretKey,
                            { expiresIn: '100d' }
                        );
                        resolve({ token: token, username: result.rows[0].fullname, role: role });
                    } else {
                        reject('Email ou password invalide');
                    }
                }).catch((err) => {
                    reject(err);
                });
            }
        }).catch((err) => {
            reject(err);
        });
    });
};

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
                resolve(result.rows)
                client.query(deleteOneUserQuery,[id])
                
            }else{
                reject('No user with the id')
            }
        })
        
           
        })
}

exports.updateUser=(id,fn,email)=>{
    return new Promise((resolve, reject) => {
                const query = `update users set fullname=$1,email=$2 where user_id=$3;`
                client.query(query, [fn,email,id]).then((result) => {
                    resolve('Mise à jour effectué avec succès!')
                }).catch((err) => {
                    reject(err)
                })
            
        

    })
}

exports.getagencyidfromuserid = (id) => {
    return new Promise((resolve, reject) => {
        const query = `select agency_id from users where user_id=$1;`
        client.query(query, [id])
            .then((result) => {
                resolve(result)
            })
            .catch((err) => {
                reject(err);
            });
    });
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
