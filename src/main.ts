import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  // get nos da acesso a algum serviço da aplicaçao, neste caso o ConfigService
  // estamos tb dizendo que a tipagem do ConfigService vai ser do tipo Env(que criamos la no env.ts)
  // que basicamente faz um parse usando o schema do env que nos definimos lá(pra saber oq é necessario de
  // ter no .env pra aplicaçao rodar sem erros)

  // aquele true do lado de env é o WasValidated, temos que passar pra true por nestjs entender que aquilo é uma
  // validaçao de campo e que ele pode inferir o tipo sem erro(que port nunca sera undefined)

  const port = configService.get('PORT', { infer: true })
  // infer = true faz a PORT inferir o tipo que passamos ali na const configService

  await app.listen(port)
}
bootstrap()
