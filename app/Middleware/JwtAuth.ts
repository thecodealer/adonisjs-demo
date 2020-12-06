import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'
import User from 'App/Models/User'

export default class JwtAuth {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const jwt = require('jsonwebtoken');

    this.ctx = ctx;
    this.ctx.jwt = {};

    const deviceId = this.getDeviceId();
    if (!deviceId) {
        return this.ctx.response.status(401).send('Device Id missing');
    }

    const token = this.getToken();
    if (!token) {
        return this.ctx.response.status(401).send('Unauthorized');
    }

    try {
        this.ctx.jwt = jwt.verify(token, Config.get('app.appKey'));        
    }
    catch(err) {
        return this.ctx.response.status(401).send(err.name);
    }

    /* Verify request's deviceId matches token's deviceId */
    if (deviceId != this.ctx.jwt.deviceId) {
        return this.ctx.response.status(401).send('Token not meant for this Device Id');
    }

    this.ctx.jwt.user = await User.find(this.ctx.jwt.sub);

    if (!this.ctx.jwt.user) {
        return this.ctx.response.status(401).send('User not found');
    }

    if (this.ctx.jwt.user.role != this.ctx.jwt.role) {
        return this.ctx.response.status(401).send('Token not meant for this user role');
    }

    await next();
  }

  private getToken(): string {
    const token = this.ctx.request.header('Authorization')?.replace('Bearer ', '').replace('bearer ', '');
    return token;
  }

  private getDeviceId(): string {
      return this.ctx.request.header('X-Device-Id');
  }
}
