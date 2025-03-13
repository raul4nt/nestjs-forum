import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Env } from 'src/env'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      // usamos o registerAsync pra criar configuraçoes na classe(service)
      inject: [ConfigService],
      // no inject colocamos os serviços que iremos injetar neste modulo
      global: true,
      async useFactory(config: ConfigService<Env, true>) {
        // funçao que recebe nosso configservice passando o env type pra dentor dele
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true })
        // pegamos lá do .env a nossa private key
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })
        // pegamos lá do .env a nossa public key

        return {
          signOptions: { algorithm: 'RS256' },
          // especificamos o tipo de algoritmo jwt que estamos usando(é aquele formato public/private keys)
          privateKey: Buffer.from(privateKey, 'base64'),
          // criamos um buffer base64 da privatekey(pra podermos retornar neste formato, é tipo uma formataçao mesmo)
          publicKey: Buffer.from(publicKey, 'base64'),
          // criamos um buffer base64 da publicKey(pra podermos retornar neste formato, é tipo uma formataçao mesmo)
        }
      },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
