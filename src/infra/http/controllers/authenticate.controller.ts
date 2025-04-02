import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>
// uma das coisas mais sensacionais do zod: ele cria/infere um tipo pra gente
// entao a gente criou o schema, e com base no schema, usamos o z.infer pra criar
// um tipo baseado nesse schema

@Public()
// torna a rota pública(conforme configuramos no public.ts)
@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  // usando o pipe do zod pra valdiar
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      // tratativa de erros no controller do Nest
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          // usamos o switch pra pegar o erro la no constructor
          // se for erro de credenciais erradas(aquele q nos mesmo criamos),
          throw new UnauthorizedException(error.message)
        // o erro mais adequado(status code, erros do proprio NestJS mesmo) é o unauthorized
        default:
          throw new BadRequestException(error.message)
        // se nao, vai cair nesse default q sao todos os outros erros q n tem caso especifico, ai simplesmente sera BadRequest
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
