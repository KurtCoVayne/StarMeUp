import { Schema, model, Document } from 'mongoose'

export interface IStar extends Document {
    senderID: string
    receiverNick: string
    receiverID: string
    message: string
    starType: string
    date: Date
    updatedAt: Date
}

const starSchema = new Schema({
    senderID: { ref: 'User', type: Schema.Types.ObjectId },
    receiverNick: { type: String, required: true },
    receiverID: { ref: 'User', type: Schema.Types.ObjectId },
    message: String,
    starType: String,
    date: { type: Date, default: Date.now },
    updatedAt: Date
})

export default model<IStar>('Star', starSchema)