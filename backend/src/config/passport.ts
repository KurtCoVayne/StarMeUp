import { Strategy, ExtractJwt } from 'passport-jwt'
import User, { getUserById, IUser } from '../models/User'
import { PassportStatic } from 'passport'

const opts = {
    secretOrKey: process.env.SECRET || 'kurtcovayne4',
    // jwtFromRequest: ExtractJwt.fromHeader('Authorization')
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    // jwtFromRequest: ExtractJwt.fromBodyField('token'),
    // jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
}
export const passportConfig = async function (passport: PassportStatic) {
    passport.use(new Strategy(opts, async (jwt_payload, done) => {
        const check: Error | IUser | false  = await getUserById(jwt_payload._id)
        
        if (check instanceof Error) {
            return done(check, false)
        }
        if (check) {
            return done(null, check)
        }
        else {
            return done(null, false)
        }
    }))
}
export default passportConfig
