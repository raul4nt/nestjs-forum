import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)
// aqui é outro jeito de colocar o ZodValidationPipe direto no body(ao inves de usar UsePipes)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
// esse UseGuards faz a gente usar um guard que é o que o nestjs usa pra proteger uma rota(neste caso estamos protegendo usando jwt)
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    // passamos o validaton pipe direto aqui no body(como eu havia falado antes) e tipamos ele
    @CurrentUser() user: UserPayload,
    // usamos o decorator que criamos no outro arquivo pra dizer qual é o usuario atual(o logado), e tipamos ele com o tipo que criamos,
    // neste caso é UserPayload(pegamos o id do usuario la do payload)
  ) {
    const { title, content } = body
    const userId = user.sub
    // pega o sub do payload que é onde fica o id

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    // const slug = this.convertToSlug(title)
    // // usamos a funçao que ta logo ali abaixo pra converter um titulo pra slug

    // await this.prisma.question.create({
    //   data: {
    //     authorId: userId,
    //     title,
    //     content,
    //     slug,
    //   },
    // })
  }

  // // funçaozinha que converte um titulo pra slug
  // private convertToSlug(title: string): string {
  //   return title
  //     .toLowerCase()
  //     .normalize('NFD')
  //     .replace(/[\u0300-\u036f]/g, '')
  //     .replace(/[^\w\s-]/g, '')
  //     .replace(/\s+/g, '-')
  // }
}
