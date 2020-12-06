import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from './BaseController';

export default class UsersController extends BaseController {
    public async index (ctx: HttpContextContract) {
        return this.handleResourceRequest(ctx);
    }

    public async create ({}: HttpContextContract) {
    }

    public async store ({}: HttpContextContract) {
    }

    public async show ({}: HttpContextContract) {
    }

    public async edit ({}: HttpContextContract) {
    }

    public async update ({}: HttpContextContract) {
    }

    public async destroy ({}: HttpContextContract) {
    }
}
