import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Slug } from './value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'

import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID | null
  title: string
  content: string
  slug: Slug
  attachments: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date | null
}

export class Question extends AggregateRoot<QuestionProps> {
  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined | null) {
    if (bestAnswerId === undefined || bestAnswerId === null) {
      return
    }

    if (
      this.props.bestAnswerId === undefined ||
      this.props.bestAnswerId === null ||
      !bestAnswerId.equals(this.props.bestAnswerId)
    ) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }

    // se já houver uma bestAnswerId definida e ela for diferente da nova,
    // disparamos um evento de domínio indicando que a melhor resposta foi alterada.
    // Isso garante que apenas mudanças reais gerem eventos.

    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    // quando atualiza o titulo, atualiza o slug tb
    this.touch()
    // usando o touch pra alterar o updatedAt
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
    // usando o touch pra alterar o updatedAt
  }

  get slug() {
    return this.props.slug
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentList) {
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

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
    // se a diferença de dias for menor ou igual a 3, é novo
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
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        // torna o slug opcional(se já tiver, usa, se nao, cria baseado no title)
        attachments: props.attachments ?? new QuestionAttachmentList(),
        // se tiver attachments ok, se nao tiver é um array vazio(lista vazia de question attachments)
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return question
  }
}
