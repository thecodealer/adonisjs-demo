import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BaseController {

    private handleResourceRequest(ctx: HttpContextContract) {
        return ctx;
    }
}
