import { Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
// esse UseGuards faz a gente usar um guard que é o que o nestjs usa pra proteger uma rota(neste caso estamos protegendo usando jwt)
export class CreateQuestionController {
  constructor() {}

  @Post()
  async handle() {}
}
