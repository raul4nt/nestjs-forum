import { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'
import { Entity } from './entity'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvents: DomainEvent[] = []
  // um root de um agregado possui uma lista de eventos

  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }
  // temos um método getter pra ver os eventos relacionados a este agregado

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
    DomainEvents.markAggregateForDispatch(this)
    // aqui nós temos uma funçao pra adicionar o evento na nossa lista de eventos deste agregado
    // e usamos a funçao markAggregateForDispatch, que marca este evento(registra), porém ainda NÃO dispara ele
    // (usamos outra funçao pra disparar)
  }

  public clearEvents() {
    this._domainEvents = []
    // limpa os eventos(zera a lista de eventos deste agregado)
  }
}
