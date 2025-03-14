import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'

type DomainEventCallback = (event: unknown) => void

export class DomainEvents {
  // seriam os subscribers
  private static handlersMap: Record<string, DomainEventCallback[]> = {}
  // seriam os eventos pendentes que ainda nao estao prontos(nao estao dispatcheds)
  private static markedAggregates: AggregateRoot<unknown>[] = []

  // marca um agregado para futura notificação de eventos
  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id)

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate)
    }
  }

  // dispara todos os eventos associados a um agregado
  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    aggregate.domainEvents.forEach((event: DomainEvent) => this.dispatch(event))
  }

  // remove um agregado da lista de agregados marcados
  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate))
    this.markedAggregates.splice(index, 1)
  }

  // busca um agregado específico na lista de agregados marcados
  private static findMarkedAggregateByID(
    id: UniqueEntityID,
  ): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id))
  }

  // dispara os eventos de um agregado específico, se ele estiver na lista
  public static dispatchEventsForAggregate(id: UniqueEntityID) {
    const aggregate = this.findMarkedAggregateByID(id)

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate)
      aggregate.clearEvents()
      this.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  // registra um callback para ser chamado quando um determinado tipo de evento for disparado
  public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = []
    }

    this.handlersMap[eventClassName].push(callback)
  }

  // limpa todos os handlers registrados
  public static clearHandlers() {
    this.handlersMap = {}
  }

  // limpa a lista de agregados marcados
  public static clearMarkedAggregates() {
    this.markedAggregates = []
  }

  // dispara um evento chamando todos os handlers registrados para ele
  private static dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name
    const isEventRegistered = eventClassName in this.handlersMap

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName]

      for (const handler of handlers) {
        handler(event)
      }
    }
  }
}
