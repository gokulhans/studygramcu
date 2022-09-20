const mongoClient = require('mongodb').MongoClient
const state = {
    db:null
}
module.exports.connect = function(done){
    const url= process.env.DATABASE_URL || 'mongodb+srv://gbrozdev:RAj%409846@cluster0.pgxe9.mongodb.net/moviesparadise?retryWrites=true&w=majority'
    const dbname='Studocu'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done() 
    })
}
  

module.exports.get=function(){
    return state.db
}
