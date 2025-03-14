import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface NotificationProps {
  recipientId: UniqueEntityID
  // recipient pois 'user' é muito generico, recipiente serve pra qualquer um que usar este subdominio
  title: string
  content: string
  readAt?: Date
  // quando foi lida(se foi)
  createdAt: Date
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get readAt() {
    return this.props.readAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  read() {
    this.props.readAt = new Date()
  }
  // atualiza o readAt de uma notificaçao(pra marcar que leu no dia, data atual)

  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueEntityID,
    // id é opcional pois podemos estar fazendo referencia pra uma NOVA notificaçao ou pra uma que JA EXISTE, por
    // isso nao sabemos se terá id ou nao
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        // se ja existe ok, se nao existe usa a data de agora pra ter a data de quando foi criada
      },
      id,
    )
    return notification
  }
}
