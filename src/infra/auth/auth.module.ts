import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt-auth.guard'
import { EnvService } from '../env/env.service'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      // usamos o registerAsync pra criar configuraçoes na classe(service)
      imports: [EnvModule],
      inject: [EnvService],
      // no inject colocamos os serviços que iremos injetar neste modulo
      global: true,
      useFactory(env: EnvService) {
        // funçao que recebe nosso configservice passando o env type pra dentor dele
        const privateKey = env.get('JWT_PRIVATE_KEY')
        // pegamos lá do .env a nossa private key
        const publicKey = env.get('JWT_PUBLIC_KEY')
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
  providers: [
    JwtStrategy,
    EnvService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // temos q passar o provide APP_GUARD e dizer q é o JwtAuthGuard q ira implementa-lo
    // ele fara uma verificaçao se a rota isPublic, e se for, torna acessivel para todos
  ],
})
export class AuthModule {}
