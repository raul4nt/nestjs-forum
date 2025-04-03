import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './env/env'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { EnvModule } from './env/env.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
      // torna ele acessivel em todo lugar(todos os modulos, etc)
    }),
    AuthModule,
    HttpModule,
    EnvModule,
  ],
  // forRoot é pra modulos que queremos passar alguma configuração, e o imports é pra importar um modulo

  // são todos os controllers deste módulo

  // todas as dependencia(inversao de dependencia/injectables) que os controllers deste modulo
  // podem vir a ter
})
export class AppModule {}
