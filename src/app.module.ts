import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from './controllers/create-account.controller'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/create-question.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
      // torna ele acessivel em todo lugar(todos os modulos, etc)
    }),
    AuthModule,
    // passando o AuthModule aqui(importando ele tb)
  ],
  // forRoot é pra modulos que queremos passar alguma configuração, e o imports é pra importar um modulo
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
  ],
  // são todos os controllers deste módulo
  providers: [PrismaService],
  // todas as dependencia(inversao de dependencia/injectables) que os controllers deste modulo
  // podem vir a ter
})
export class AppModule {}
