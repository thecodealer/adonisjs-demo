import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'
import Hash from '@ioc:Adonis/Core/Hash'
import moment from 'moment'
import User from 'App/Models/User'

export default class AuthController {
    public async login (ctx: HttpContextContract) {
        const data = ctx.request.only(['username', 'password']);
        const user = await User.query().where('username', data.username).first();
        if (!user) {
            return ctx.response.status(401).send('User not found');
        }
        const valid_password = await Hash.verify(user.password, data.password);
        if (!valid_password) {
            return ctx.response.status(401).send('Username/password incorrect');
        }

        const jwt = require('jsonwebtoken');
        const jwt_payload = {
            sub: user.id,
            role: user.role,
            deviceId: ctx.request.header('X-Device-Id'),
            exp: moment().add(14, 'days').unix()
        }

        const token = jwt.sign(jwt_payload, Config.get('app.appKey'));

        return {user, token};
    }

    public async signup (ctx: HttpContextContract) {
        const fields = ctx.request.all()
        const user = new User();
        try {
            user.fill(fields);
        }
        catch(e) {
            return ctx.response.status(400).send(e.message);
        }

        user.password = await Hash.make(user.password);
        user.role = 'user';
        await user.save();

        return user;
    }
}
