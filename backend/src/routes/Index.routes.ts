import { Request, Response, Router } from 'express'

class IndexRoutes {
    router: Router
    constructor() {
        this.router = Router()
    }

    routing(){
        this.router.get('*',(req,res) => res.send('Api: /api/stars'))
    }
}

const indexRoutes = new IndexRoutes()
indexRoutes.routing()

export default indexRoutes.router