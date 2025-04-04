import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from './public'

// classe base para usarmos nosso guard com um nome personalizado(usaremos pra Jwt, por isso o nome)

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }
    // verifica se a rota é publica

    return super.canActivate(context)
    // se nao for publica vai cair neste return, que basicamente chama a implementaçao
    // do AuthGuard para verificar se a requisição é autenticada.
  }
}
