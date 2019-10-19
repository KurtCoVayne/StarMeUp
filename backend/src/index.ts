import express from 'express'
import morgan from 'morgan'
import indexRoutes from './routes/Index.routes'
import starsRoutes from './routes/Stars.routes'
import authRoutes from './routes/Auth.routes'
import passport from 'passport'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'

import dotenv from 'dotenv'
dotenv.config()

class Server {
    app: express.Application
    constructor() {
        this.app = express()
        this.config()
        this.routing()
    }
    config() {
        //Database
        const MONGO_URI = 'mongodb://localhost/starmeup'
        mongoose.connect(process.env.MONGODB_URL || MONGO_URI , {
            useFindAndModify:false,
            useUnifiedTopology:true,
            useNewUrlParser: true,
            useCreateIndex: true
        })
            .then(db => console.log('DB IS CONNECTED'))
            .catch(e => {
                 console.error(e,'FINISHING DUE TO DATABASE FAIL')
                 process.exit() 
                })
        //Settings
        this.app.set('port', process.env.PORT || '3000')

        //Middlewares
        this.app.use(morgan('dev'))
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended:false}))
        this.app.use(cors())
        this.app.use(express.static(path.join(__dirname, 'public')))
    }
    passport() {
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }
    routing() {
        this.app.use(indexRoutes)
        this.app.use('/api/stars',starsRoutes)
        this.app.use('/api/auth',authRoutes)
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('RUNNING ON', this.app.get('port'))
        })
    }
}

new Server().start()