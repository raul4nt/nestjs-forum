import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'
import { EnvService } from '../env/env.service'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>
// vamos usar esse tipo dep+ois la no CurrentUserDecorator

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // PassportStrategy é o que usamos(classe) pra aplicar uma auth strategy na nossa aplicaçao
  constructor(config: EnvService) {
    // pega os dados do env usando o configservice
    const publicKey = config.get('JWT_PUBLIC_KEY')
    // pegamos nossa jwt public key(que é a que vai gerar uma key nova com base na private key)

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // extraimos o jwt do header(bearer token)
      secretOrKey: Buffer.from(publicKey, 'base64'),
      // formatamos em base64
      algorithms: ['RS256'],
      // deixamos explicito o algoritmo jwt que estamos usando
    })
  }

  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload)
    // usamos o parse pra ver se esta tudo de acordo(se estamos recebendo um sub no payload)
  }
}
