import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from './controllers/create-account.controller'
import { envSchema } from './env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
      // torna ele acessivel em todo lugar(todos os modulos, etc)
    }),
  ],
  // forRoot é pra modulos que queremos passar alguma configuração, e o imports é pra importar um modulo
  controllers: [CreateAccountController],
  // são todos os controllers deste módulo
  providers: [PrismaService],
  // todas as dependencia(inversao de dependencia/injectables) que os controllers deste modulo
  // podem vir a ter
})
export class AppModule {}
