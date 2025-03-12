import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

// precisamos colocar o injectable pra dizer que esta classe(service) pode ser implementada em outro lugar
// (ser injetada em um controller)
@Injectable()
// extende a classe do PrismaClient pra termos acesso ao construtor dela e os metodos(conexao com banco)
// implementa esses OnModules que servem basicamente pra fazer açoes quando o modulo iniciar ou quando ele
// finalizar(seja por erro inesperado ou afins)
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['warn', 'error'],
      // no super(constructor), ou seja, da classe extendida pai(PrismaClient) temos acesso
      // ao log do construtor, que podemos passar várias coisas pra ele
      // neste caso estamos passando warn e error, ou seja, gerará apenas logs de erro e advertências
      // (pra ficarmos sabendo caso algo de errado)
    })
  }

  onModuleInit() {
    return this.$connect
    // conecta com o banco quando o módulo iniciar
  }

  onModuleDestroy() {
    return this.$disconnect
    // desconecta do banco quando o módulo finalizar/ser destruido
  }
}
