import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
      // torna ele acessivel em todo lugar(todos os modulos, etc)
    }),
    AuthModule,
    HttpModule,
  ],
  // forRoot é pra modulos que queremos passar alguma configuração, e o imports é pra importar um modulo

  // são todos os controllers deste módulo

  // todas as dependencia(inversao de dependencia/injectables) que os controllers deste modulo
  // podem vir a ter
})
export class AppModule {}
