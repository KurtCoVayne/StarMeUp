import { Request, Response, Router } from 'express'
import Star, { IStar } from '../models/Star'
import passport from 'passport'
import passportConfig from '../config/passport'
import User, { existingUser, giveFiveStars } from '../models/User'

class StarsRoutes {
    router: Router
    constructor() {
        this.router = Router()
    }

    public async getStar(req: Request, res: Response): Promise<void> {
        try {
            const star = await Star.findById(req.params.id)
            if (star === null) {
                res.status(404).json({ ok: true, statusText: "Couldnt found a star with that id" })
            } else {
                res.status(200).json({ ok: true, data: { star } })
            }
        } catch (error) {
            res.status(500).json({ ok: false, statusText: "Something went wrong :(" })
            console.error(error)
        }
    }
    async getStars(req: Request, res: Response): Promise<void> {
        try {
            const stars = await Star.find()
            if (stars.length === 0) {
                res.status(200).json({ ok: true, statusText: "Theres no stars yet" })
            } else {
                res.status(200).json({ ok: true, data: stars })
            }
        } catch (error) {
            res.status(500).json({ ok: false, statusText: "Something went wrong :(" })
            console.error(error)
        }
    }
    public async sendStar(req: Request, res: Response): Promise<void> {
        const { receiverNick, message, starType } = req.body
        if(!receiverNick || !message || !starType){
            res.status(400).json({ok:false,statusText:"Bad Request: there's data missing"})
        }else{
            try {
                const senderUser: any = req.user
            const receiverUser = await existingUser(receiverNick)
            if (receiverUser) {
                const star = new Star({
                    senderID: senderUser._id,
                    receiverNick,
                    receiverID: receiverUser._id,
                    message,
                    starType,
                    updatedAt: Date.now()
                })
                await star.save()
                await User.findByIdAndUpdate(senderUser._id, {$inc:{"stars.${startype}": -1}, $push: { sentStars: star._id } })
                await User.findByIdAndUpdate(receiverUser._id, {$inc:{"stars.${startype}": 1}, $push: { receivedStars: star._id } })
                res.status(200).json({ok:true,data:star})
            }else{
                res.status(404).json({ok:true,statusText:"There's no user with that nickname"})
            }
            } catch (error) {
                res.status(500).json({ ok: false, statusText: "Something went wrong :(" })
                console.error(error)
            }
        }
    }
    public async updateStar(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const {message} = req.body
            if(!id || !message){
                res.status(400).json({ok:false,statusText:"Bad Request: there's data missing"})
            }else{
                const star = await Star.findByIdAndUpdate(id, {message}, { new: true })
                if(star === null){
                    res.status(404).json({ ok: true, statusText: "Couldnt found a star with that id" })
                }else{
                    res.status(200).json({ok:true,data:star})
                }
            }
        
        } catch (error) {
            res.status(500).json({ ok: false, statusText: "Something went wrong :(" })
            console.error(error)
        }
        
    }
    public async deleteStar(req: Request, res: Response): Promise<void> {
        
        try {
            const { id } = req.params
            const star = await Star.findByIdAndDelete(id)
            if(star === null){
                res.status(404).json({ ok: true, statusText: "Couldnt found a star with that id" })
            }else{
                res.status(200).json({ok:true,statusText:"Deleted succesfully"})
            }
        } catch (error) {
            res.status(500).json({ ok: false, statusText: "Something went wrong :(" })
            console.error(error)
        }
        
    }
    routing() {
        passportConfig(passport);
        this.router.get('/', passport.authenticate('jwt', { session: false }), this.getStars)
        this.router.get('/:id', passport.authenticate('jwt', { session: false }), this.getStar)
        this.router.post('/', passport.authenticate('jwt', { session: false }), this.sendStar)
        this.router.put('/:id', passport.authenticate('jwt', { session: false }), this.updateStar)
        this.router.delete('/:id', passport.authenticate('jwt', { session: false }), this.deleteStar)
    }
}

const starsRoutes = new StarsRoutes()
starsRoutes.routing()

export default starsRoutes.router