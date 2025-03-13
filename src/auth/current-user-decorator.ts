import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserPayload } from './jwt.strategy'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    // passamos never pra dizer que ele nao sera usado em um controlador ou serviço
    // passamos o context(neste caso o Execution, que fornece informaçoes sobre o contexto
    // de execuçao, ou seja, informaçoes http, resposta http, handler, etc)
    const request = context.switchToHttp().getRequest()
    // usamos o metodo switchToHttp pra acessarmos o metodo getRequest e pegar a requisiçao

    return request.user as UserPayload
    // por fim, pegamos o user da requisiçao e tipamos ele como UserPayload
  },
)
