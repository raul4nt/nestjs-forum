import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Env } from 'src/env'
import { z } from 'zod'

const tokenSchema = z.object({
  sub: z.string().uuid(),
})

type TokenSchema = z.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // PassportStrategy é o que usamos(classe) pra aplicar uma auth strategy na nossa aplicaçao
  constructor(config: ConfigService<Env, true>) {
    // pega os dados do env usando o configservice
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })
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

  async validate(payload: TokenSchema) {
    return tokenSchema.parse(payload)
    // usamos o parse pra ver se esta tudo de acordo(se estamos recebendo um sub no payload)
  }
}
