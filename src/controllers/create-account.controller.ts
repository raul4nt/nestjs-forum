import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'

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

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

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

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists.',
      )
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  }
}
