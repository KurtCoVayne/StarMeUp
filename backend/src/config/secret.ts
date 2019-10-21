import dotenv from 'dotenv'
dotenv.config()
export const cfg = {
    jwtSecret: process.env.SECRET || 'kurtcovayne4',
    jwtSession: {
        session: false
    }
}
export let password = process.env.PASSWORD
export let mongo_uri = process.env.MONGODB_URL
export let secret = process.env.SECRET
export let mail = process.env.MAIL
if (!password || !mongo_uri || !secret || !mail) {
    console.log(password, mongo_uri, secret, mail)
    console.error("FINISHING DUE TO NOT ENOUGH ENV VARIABLES")
    process.exit()
}
export default cfg