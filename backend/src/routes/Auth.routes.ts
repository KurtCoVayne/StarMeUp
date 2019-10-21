import { Request, Response, Router } from 'express'
import User, { addUser, comparePassword, existingUser } from '../models/User'
import cfg from '../config/secret'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import passportConfig from '../config/passport'

class AuthRoutes {
    router: Router
    constructor() {
        this.router = Router()
    }

    public async logup(req: Request, res: Response): Promise<void> {
        const { name, nickname, email, password } = req.body
        let newUser = new User({
            name,
            email,
            nickname,
            password
        })
        const { status, ok, statusText } = await addUser(newUser)
        res.status(status).json({ ok, statusText })
    }
    public async login(req: Request, res: Response) {
        try {
            const { nickname, password, email } = req.body
            if ((!nickname || !email) && !password) {
                res.status(400).json({ ok: false, statusText: "Bad Request: there's data missing" })
            } else {
                const user = await existingUser(nickname, email)
                if (!user) {
                    return res.status(401).json({ ok: false, statusText: 'User with that nickname/mail dont found' })
                }
                if (await comparePassword(password, user.password)) {
                    const token = jwt.sign(user.toJSON(), cfg.jwtSecret, {
                        expiresIn: 604800 // 1 week
                    })
                    res.status(200).json({
                        ok: true,
                        data: {
                            token: 'JWT ' + token,
                            user: {
                                user
                            }
                        }
                    })
                } else {
                    return res.status(401).json({ ok: false, statusText: 'Wrong password' })
                }
            }
        } catch (error) {
            res.status(500).json({ ok: false, statusText: "Something went wrong :(" })
            console.error(error)
        }

    }
    public profile(req: Request, res: Response) {
        res.json({ data: { user: req.user } })
    }

    routing() {
        passportConfig(passport);
        this.router.get('/', (req, res) => res.send('Api: /api/stars'))
        this.router.post('/logup', this.logup)
        this.router.post('/login', this.login)
        this.router.get('/profile', passport.authenticate('jwt', { session: false }), this.profile)
    }

}

const authRoutes = new AuthRoutes()
authRoutes.routing()

export default authRoutes.router