import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error'
import { Public } from '@/infra/auth/public'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  // criando o schema do objeto usando zod(pra uma posterior validação de campos)
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>
// uma das coisas mais sensacionais do zod: ele cria/infere um tipo pra gente
// entao a gente criou o schema, e com base no schema, usamos o z.infer pra criar
// um tipo baseado nesse schema

@Public()
// torna a rota pública(conforme configuramos no public.ts)
@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  // esse UsePipes serve pra usarmos uma pipe aqui como quase um middleware no nosso controller
  // entao passamos o schema pra ele e ele já faz o parse pra ver se esta tudo de acordo antes de
  // executar o resto do codigo
  async handle(@Body() body: CreateAccountBodySchema) {
    // passamos aqui o tipo criado usando zod pra dizer qual formato a gente espera que venha
    // no body da nossa requisição
    const { name, email, password } = body

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
