import * as nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { IUser } from 'models/User'
import { password,mail } from '../config/secret'
dotenv.config()
class MailService {
    _transporter: nodemailer.Transporter
    constructor() {
        this._transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mail || "johnalejandrog.g4@gmail.com",
                pass: password || "123"
            }
        })
    }
    public sendStarAdvice(receiverUser: IUser, senderUser: any, starType: string, message: string) {
        let mailOptions = {
            from: 'Estrellame Globant',
            to: receiverUser.email,
            subject: 'Te han enviado una estrella!',
            html: `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <style> :root { --blue: #007bff; --indigo: #6610f2; --purple: #6f42c1; --pink: #e83e8c; --red: #dc3545; --orange: #fd7e14; --yellow: #ffc107; --green: #28a745; --teal: #20c997; --cyan: #17a2b8; --white: #fff; --gray: #6c757d; --gray-dark: #343a40; --primary: #007bff; --secondary: #6c757d; --success: #28a745; --info: #17a2b8; --warning: #ffc107; --danger: #dc3545; --light: #f8f9fa; --dark: #343a40; --breakpoint-xs: 0; --breakpoint-sm: 576px; --breakpoint-md: 768px; --breakpoint-lg: 992px; --breakpoint-xl: 1200px; --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; } *, *::before, *::after { box-sizing: border-box; } html { font-family: sans-serif; line-height: 1.15; -webkit-text-size-adjust: 100%; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); } *, ::after, ::before { box-sizing: border-box; } p { margin-top: 0; margin-bottom: 1rem; } a { color: #007bff; text-decoration: none; background-color: transparent; } a:hover { color: #0056b3; text-decoration: underline; } img { vertical-align: middle; border-style: none; } .h1 { margin-bottom: .5rem; font-weight: 500; line-height: 1.2; } .h1 { font-size: 2.5rem; } .navbar-brand { display: inline-block; padding-top: .3125rem; padding-bottom: .3125rem; margin-right: 1rem; font-size: 1.25rem; line-height: inherit; white-space: nowrap; } .navbar-brand:focus, .navbar-brand:hover { text-decoration: none; } .navbar-light .navbar-brand { color: rgba(0, 0, 0, .9); } .navbar-light .navbar-brand:focus, .navbar-light .navbar-brand:hover { color: rgba(0, 0, 0, .9); } .text-left { text-align: left !important; } .font-weight-bold { font-weight: 700 !important; } .font-italic { font-style: italic !important; } .text-muted { color: #6c757d !important; } @media print { *, ::after, ::before { text-shadow: none !important; box-shadow: none !important; } a:not(.btn) { text-decoration: underline; } img { page-break-inside: avoid; } p { orphans: 3; widows: 3; } } .mx-auto{ margin-left: auto!important; margin-right: auto!important; } .star { transform: rotate(10deg) translateX(0%) translateY(-11%); } </style> </head> <body> <a class="navbar-brand mx-auto" href="#"> <p class="h1 text-left font-weight-bold font-italic text-muted display-4vw">ESTRELL<img alt="A" aria-label="A" class="star" height="10%" src="data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhciIgZGF0YS1pY29uPSJzdGFyIiBjbGFzcz0ic3ZnLWlubGluZS0tZmEgZmEtc3RhciBmYS13LTE4IiByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDU3NiA1MTIiPjxwYXRoIGZpbGw9ImN5YW4iIGQ9Ik01MjguMSAxNzEuNUwzODIgMTUwLjIgMzE2LjcgMTcuOGMtMTEuNy0yMy42LTQ1LjYtMjMuOS01Ny40IDBMMTk0IDE1MC4yIDQ3LjkgMTcxLjVjLTI2LjIgMy44LTM2LjcgMzYuMS0xNy43IDU0LjZsMTA1LjcgMTAzLTI1IDE0NS41Yy00LjUgMjYuMyAyMy4yIDQ2IDQ2LjQgMzMuN0wyODggNDM5LjZsMTMwLjcgNjguN2MyMy4yIDEyLjIgNTAuOS03LjQgNDYuNC0zMy43bC0yNS0xNDUuNSAxMDUuNy0xMDNjMTktMTguNSA4LjUtNTAuOC0xNy43LTU0LjZ6TTM4OC42IDMxMi4zbDIzLjcgMTM4LjRMMjg4IDM4NS40bC0xMjQuMyA2NS4zIDIzLjctMTM4LjQtMTAwLjYtOTggMTM5LTIwLjIgNjIuMi0xMjYgNjIuMiAxMjYgMTM5IDIwLjItMTAwLjYgOTh6Ij48L3BhdGg+PC9zdmc+" width="10%">ME</p> </a> <p>${senderUser.nickname} te ha enviado una estrella ${starType} y dijo ${message}</p> </body> </html>`
        }

        this._transporter.sendMail(mailOptions, (e: Error | null, info: any) => {
            if (e) {
                console.error(e)
            } else {
                console.log("Mail sent: " + info.response)
            }
        })
    }
}
const mailService = new MailService()
export default mailService