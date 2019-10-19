import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
    _id:string;
    name: string;
    nickname: string;
    email: string;
    password: string;
    birthDate: string;
    createdAt: Date;
    lastActivity: Date;
    receivedStars: Array<String>;
    sentStars: Array<String>;
    stars: Array<Object>;
}

const userSchema = new Schema({
    name: { type: String, required: true },
    nickname: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    birthDate: Date,
    createdAt: { type: Date, default: Date.now },
    lastActivity: Date,
    receivedStars: [{
        type: Schema.Types.ObjectId,
        ref: 'Star'
    }],
    sentStars: [{
        type: Schema.Types.ObjectId,
        ref: 'Star'
    }],
    stars: {
        blue: {type:Number,default:5},
        purple: {type:Number,default:5},
        pink: {type:Number,default:5},
        orange: {type:Number,default:5},
        yellow: {type:Number,default:5},
        green: {type:Number,default:5}
    }

})

export const User = model<IUser>('User', userSchema)
export default User
export const existingUser = async function (nickname?: string, email?: string): Promise<IUser | false> {
    try {
        const user = await User.findOne({ $or: [{ email }, { nickname }] })
            .populate('sentStars').populate('receivedStars')
        if (user) {
            return user
        }
        return false
    }
    catch (e) {
        const error: Error = e
        console.error(error)
        return false
    }
}
export let getUserById = async function (id: string) {
    // User.findById(id, calback)
    try {
        const user = await User.findById(id).populate('sentStars').populate('receivedStars')
        if (user) {
            return user
        }
        return false
    } catch (e) {
        const error: Error = e
        console.error(error)
        return error
    }
}
export const addUser = async function (newUser: IUser) {
    try {
        const _existingUser = await existingUser(newUser.nickname, newUser.email)
        if (!_existingUser) {
            const salt = await bcrypt.genSalt(10)
            newUser.password = await bcrypt.hash(newUser.password, salt)
            newUser.save()
            return { ok: true, status:200,statusText: `You were registered succesfully, now you can login` }
        } else {
            return { ok: false, status: 412, statusText: `There's already an user with that mail/nickname` }
        }
    } catch (e) {
        const error: Error = e
        console.error(error)
        return { ok: false, status: 500, statusText: `Something went wrong :(` }
    }
}
export const comparePassword = async function (candidatePassword: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, hash)
}
export const giveFiveStars = async function (_id?: String) {
    if(!_id){
        return
    }
    User.findByIdAndUpdate(_id, { $inc: { 'stars.blue': 5, 'stars.purple': 5, 'stars.pink': 5, 'stars.orange': 5, 'stars.yellow': 5, 'stars.green': 5 } })
}