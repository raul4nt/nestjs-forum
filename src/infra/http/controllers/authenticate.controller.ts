import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>
// uma das coisas mais sensacionais do zod: ele cria/infere um tipo pra gente
// entao a gente criou o schema, e com base no schema, usamos o z.infer pra criar
// um tipo baseado nesse schema

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    // colocamos o JwtService do nestjs aqui usando inversao de dependencia
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  // usando o pipe do zod pra valdiar
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      // procura se tem um usuario com este email
    })

    if (!user) {
      throw new UnauthorizedException('User credentials do not match.')
      // se nao existir no banco, da erro
    }

    const isPasswordValid = await compare(password, user.password)
    // compara a senha usando o metodo do bcrypt

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match.')
      // se a senha tiver errada da erro
    }

    const accessToken = this.jwt.sign({ sub: user.id })
    // usa o jwt sign pra de fato assinar o token(uma vez que as  credencias do usuario estao certas)
    // isso gera um token pra ele usar a aplicaçao
    // colocamos no sub o id do usuario pra sabermos de quem pertence este token

    return {
      access_token: accessToken,
    }
  }
}
