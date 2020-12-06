import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'
import User from 'App/Models/User'

export default class JwtAuth {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const jwt = require('jsonwebtoken');

    ctx.jwt = {};

    const deviceId = this.getDeviceId(ctx);
    if (!deviceId) {
        return ctx.response.status(401).send('Device Id missing');
    }

    const token = this.getToken(ctx);
    if (!token) {
        return ctx.response.status(401).send('Unauthorized');
    }

    try {
        ctx.jwt = jwt.verify(token, Config.get('app.appKey'));        
    }
    catch(err) {
        return ctx.response.status(401).send(err.name);
    }

    /* Verify request's deviceId matches token's deviceId */
    if (deviceId != ctx.jwt.deviceId) {
        return ctx.response.status(401).send('Token not meant for this Device Id');
    }

    ctx.jwt.user = await User.find(ctx.jwt.sub);

    if (!ctx.jwt.user) {
        return ctx.response.status(401).send('User not found');
    }

    if (ctx.jwt.user.role != ctx.jwt.role) {
        return ctx.response.status(401).send('Token not meant for this user role');
    }

    await next();
  }

  private getToken(ctx): string {
    const token = ctx.request.header('Authorization')?.replace('Bearer ', '').replace('bearer ', '');
    return token;
  }

  private getDeviceId(ctx): string {
      return ctx.request.header('X-Device-Id');
  }
}
