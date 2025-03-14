import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      // usamos o bind pra indicar que quando eu usar o this, ele tem que ser o mesmo
      // this deste momento aqui(ou seja, desta classe)
      // isso porque a funçao sendQuestionBestAnswerNotification sera usada como handler la dentro de DomainEvents, e lá
      // o this significará outra coisa pois será um this DA OUTRA CLASSE, e nao desta
      // entao é mais pra nao dar erro mesmo
      QuestionBestAnswerChosenEvent.name,
      // esse name é do proprio js/ts e pega o nome da function
    )
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )
    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua resposta foi escolhida!`,
        content: `A resposta que você enviou em "${question.title.substring(0, 20).concat('...')}"`,
      })
    }
  }
}
