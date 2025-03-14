import { UniqueEntityID } from '../entities/unique-entity-id'

export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityID
  // interface pra simbolizar um evento
  // tem a data que ele ocorreo e o ID do agregado que ele está relacionado
  // no caso colocamos agregado porque geralmente é um agregado que dispará eventos, mas nao é necessariamente uma regra
}
