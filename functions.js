const bcrypt = require('bcrypt')
var db = require('./connection')
var ObjectId = require('mongodb').ObjectId
const cloudinary = require("cloudinary");


module.exports={
    doSignup:(userdata)=>{
        return new Promise(async(resolve,reject)=>{
            let user= await db.get().collection('users').findOne({gmail:userdata.gmail})
            if (user) {
                let response = {}
                response.signupstatus = false
                resolve(response)
            } else {
                userdata.password=await bcrypt.hash(userdata.password,10)
                db.get().collection('users').insertOne(userdata).then((response)=>{
                    response.signupstatus = true
                    resolve(response)
                })            
            }
        })
    }, 
    doLogin:(userdata)=>{
        return new Promise(async(resolve,reject)=>{
            let user= await db.get().collection('users').findOne({gmail:userdata.gmail}).then((response) => {
                return userobj = response
            })
            
            let response = {}
            if (user) {
                
                let validPassword = await bcrypt.compare(userdata.password,user.password)
                if(!validPassword){
                    console.log('login failed');
                    response.status = false
                    resolve(response)
                }else {
                    console.log('login success');
                    response.status = true
                    response.user = userobj
                    resolve(response)
                }
            }else{
                console.log('login failed');
                    response.status = false
                    resolve(response)
            }
            })  
    },
}