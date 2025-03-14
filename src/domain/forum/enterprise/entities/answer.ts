import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AnswerAttachmentList } from './answer-attachment-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { AnswerCreatedEvent } from '../events/answer-created-event'

export interface AnswerProps {
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  content: string
  attachments: AnswerAttachmentList
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends AggregateRoot<AnswerProps> {
  get content() {
    return this.props.content
    // método get pra acessar a prop content(que agora fica dentro da propriedade
    // props do constructor pai(Entity))
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments
    this.touch()
    // usando o touch pra alterar o updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get excerpt() {
    // excerpt significa trecho(pega um trecho da resposta)
    return this.content.substring(0, 120).trimEnd().concat('...')
    // cria uma substring do content q vai do 0 ao 120(caracteres),
    // depois usa o trim pra tirar os espaços do final e concatena com '...'
    // pra mostrar que continua(preview da resposta)
  }

  private touch() {
    this.props.updatedAt = new Date()
    // método que chamamos quando vamos setar(atualizar) algo
  }

  static create(
    // funçao estatica padrao pra toda entidade(criar ela)
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    // usamos esse Optional(definido na pasta
    // types para pegar as props e definir alguma como opcional)
    // neste caso, nao é que createdAt realmente seja opcional,
    // mas eu vou setar essa prop logo na criaçao da entidade nova
    // (nao quero passar ela manualmente em json numa rota post
    // , por exemplo)
    id?: UniqueEntityID,
  ) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewAnswer = !id
    // deixa o if mais semantico

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
      // se a resposta for nova(ou seja, nao tiver já um id existente) eu uso o addDomainEvent criando
      // um evento pra essa resposta(registrando, nao estou disparando nada, o banco que vai disparar esse evento depois)
    }

    return answer
  }
}
