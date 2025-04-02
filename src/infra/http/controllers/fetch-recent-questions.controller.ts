import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { QuestionPresenter } from '../presenters/question-presenter'

const pageQueryParamSchema = z
  .string()
  // espera que seja uma string
  .optional()
  // é um campo opcional
  .default('1')
  // valor default é 1(caso o usuario nao passe a pagina desejada)
  .transform(Number)
  // depois a gente transforma isso em um numero(pois inicialmente ele vai vir como string)
  .pipe(z.number().min(1))
// e depois usamos esse pipe pro typescript entender que isso é um numero, se nao ele acha que é uma string por termos começado com z.string
// minumo de 1 porque a pagina tem que ser no minimo 1, nao tem como ser menos que isso, ai ja é uma validaçao a mais q fazemos

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
// validamos nosso schema usando o ZodValidationPipe

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
// @UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    // usamos o @Query que é pra justamente acessar os paraemtros que vem na url(neste caso o page) e validamos
    // a page passada pelo usuario usando o validationpipe
    // const perPage = 20
    // definimos que é 20 questionS por pagina

    const result = await this.fetchRecentQuestions.execute({
      page,
    })

    // const questions = await this.prisma.question.findMany({
    //   take: perPage,
    //   // pega um só por pagina(usando o findMany do prisma(database))
    //   skip: (page - 1) * perPage,
    //   // usamos o skip pra pular de tanto em tanto
    //   orderBy: {
    //     createdAt: 'desc',
    //     // ordenamos em ordem decrescente de criaçao(os mais recentes)
    //   },
    // })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questions = result.value.questions

    // usando o map pra converter(usando o presenter de question) a nossa lista de perguntas
    // de modo que fique mais amigavel pro front
    return { questions: questions.map(QuestionPresenter.toHTTP) }
  }
}
