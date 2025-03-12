import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from './controllers/create-account.controller'

@Module({
  imports: [],
  controllers: [CreateAccountController],
  // são todos os controllers deste módulo
  providers: [PrismaService],
  // todas as dependencia(inversao de dependencia/injectables) que os controllers deste modulo
  // podem vir a ter
})
export class AppModule {}
