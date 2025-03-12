import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaService } from './prisma/prisma.service'

@Module({
  imports: [],
  controllers: [AppController],
  // são todos os controllers deste módulo
  providers: [AppService, PrismaService],
  // todas as dependencia(inversao de dependencia/injectables) que os controllers deste modulo
  // podem vir a ter
})
export class AppModule {}
