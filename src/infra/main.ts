import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/infra/app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  await app.listen(port)

  // const configService = app.get<ConfigService<Env, true>>(ConfigService)
  // get nos da acesso a algum serviço da aplicaçao, neste caso o ConfigService
  // estamos tb dizendo que a tipagem do ConfigService vai ser do tipo Env(que criamos la no env.ts)
  // que basicamente faz um parse usando o schema do env que nos definimos lá(pra saber oq é necessario de
  // ter no .env pra aplicaçao rodar sem erros)

  // aquele true do lado de env é o WasValidated, temos que passar pra true por nestjs entender que aquilo é uma
  // validaçao de campo e que ele pode inferir o tipo sem erro(que port nunca sera undefined)

  // const port = configService.get('PORT', { infer: true })
  // infer = true faz a PORT inferir o tipo que passamos ali na const configService
}
bootstrap()
