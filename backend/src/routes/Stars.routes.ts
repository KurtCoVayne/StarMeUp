import { Request, Response, Router } from 'express'
import Star, { IStar } from '../models/Star'
import passport from 'passport'
import passportConfig from '../config/passport'
import User, { existingUser, giveFiveStars } from '../models/User'
import mailService from '../mail/MailService'

class StarsRoutes {
    router: Router
    constructor() {
        this.router = Router()
    }

    public async getStar(req: Request, res: Response): Promise<void> {
        try {
            const star = await Star.findById(req.params.id)
            if (star === null) {
                res.status(404).json({ ok: false, statusText: "Couldnt found a star with that id" })
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
        if (!receiverNick || !starType) {
            res.status(400).json({ ok: false, statusText: "Bad Request: there's data missing" })
        } else {
            try {
                const senderUser: any = req.user
                const receiverUser = await existingUser(receiverNick)
                if (senderUser['stars'][starType] === 0) {
                    res.status(200).json({ ok: false, statusText: "User doesn't have enough stars to send" })
                } else if (receiverUser && receiverUser.nickname != senderUser.nickname) {
                    const star = new Star({
                        senderID: senderUser._id,
                        receiverNick,
                        receiverID: receiverUser._id,
                        message,
                        starType,
                        updatedAt: Date.now()
                    })
                    let senderUpdate: any;
                    let receiverUpdate: any;
                    switch (starType) {
                        case "blue":
                            senderUpdate = { "$inc": { "stars.blue": -1 }, "$push": { "sentStars": star._id } }
                            receiverUpdate = { "$inc": { "stars.blue": 1 }, "$push": { "receivedStars": star._id } }
                            break
                        case "purple":
                            senderUpdate = { "$inc": { "stars.purple": -1 }, "$push": { "sentStars": star._id } }
                            receiverUpdate = { "$inc": { "stars.purple": 1 }, "$push": { "receivedStars": star._id } }
                            break
                        case "pink":
                            senderUpdate = { "$inc": { "stars.pink": -1 }, "$push": { "sentStars": star._id } }
                            receiverUpdate = { "$inc": { "stars.pink": 1 }, "$push": { "receivedStars": star._id } }
                            break
                        case "orange":
                            senderUpdate = { "$inc": { "stars.orange": -1 }, "$push": { "sentStars": star._id } }
                            receiverUpdate = { "$inc": { "stars.orange": 1 }, "$push": { "receivedStars": star._id } }
                            break
                        case "yellow":
                            senderUpdate = { "$inc": { "stars.yellow": -1 }, "$push": { "sentStars": star._id } }
                            receiverUpdate = { "$inc": { "stars.yellow": 1 }, "$push": { "receivedStars": star._id } }
                            break
                        case "green":
                            senderUpdate = { "$inc": { "stars.green": -1 }, "$push": { "sentStars": star._id } }
                            receiverUpdate = { "$inc": { "stars.green": 1 }, "$push": { "receivedStars": star._id } }
                            break
                        default:
                            res.status(400).json({ ok: false, statusText: "Bad Request: " + starType + " is not a valid Star type" })
                            return
                    }
                    mailService.sendStarAdvice(receiverUser,senderUser, starType,message)
                    await star.save()
                    await User.findByIdAndUpdate(senderUser._id, senderUpdate)
                    await User.findByIdAndUpdate(receiverUser._id, receiverUpdate)
                    res.status(200).json({ ok: true, data: star })
                } else {
                    res.status(404).json({ ok: false, statusText: "Invalid nickname" })
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
            const { message } = req.body
            if (!id || !message) {
                res.status(400).json({ ok: false, statusText: "Bad Request: there's data missing" })
            } else {
                const star = await Star.findByIdAndUpdate(id, { message }, { new: true })
                if (star === null) {
                    res.status(404).json({ ok: false, statusText: "Couldnt found a star with that id" })
                } else {
                    res.status(200).json({ ok: true, data: star })
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
            if (star === null) {
                res.status(404).json({ ok: false, statusText: "Couldnt found a star with that id" })
            } else {
                res.status(200).json({ ok: true, statusText: "Deleted succesfully" })
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