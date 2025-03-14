import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      // usamos o bind pra indicar que quando eu usar o this, ele tem que ser o mesmo
      // this deste momento aqui(ou seja, desta classe)
      // isso porque a funçao sendAnswerNotification sera usada como handler la dentro de DomainEvents, e lá
      // o this significará outra coisa pois será um this DA OUTRA CLASSE, e nao desta
      // entao é mais pra nao dar erro mesmo
      AnswerCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title.substring(0, 40).concat('...')}"`,
        // substring corta o texto(pois pode ser grande) do index 0 ao 40, e o concat é usado pra
        // concatenar pra colocar que continua
        content: answer.excerpt,
      })
    }
  }
}
