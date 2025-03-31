import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
      // traduzindo: toda vez que o Nest ver alguem q esta usando(o provide) como dependencia a classe abstrata
      // QuestionsRepository, use o PrismaQuestionsRepository(useClass) pra resolve-la
    },
    PrismaQuestionsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
  ],
  // exportando pra que eu possa importar o DatabaseModule em outro module e este modulo que esta importando este possa tb usar
  // o PrismaService. se eu usar apenas providers, ele torna o PrismaService disponivel apenas DIRETAMENTE neste modulo aqui
  // entao se importar pra outro o PrismaService n funcionaria
})
export class DatabaseModule {}
