import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'
import { vi } from 'vitest'

// classe que representa um evento
class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()
    // fn é um metodo do vitest que é basicamente uma funçao que nos diz se a funçao foi "ativada" ou nao

    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)
    // Subscriber cadastrado(ouvindo o evento de "resposta(answer) criada")
    // neste caso passamos como parametro ela aqui pq queremos saber quando que o evento de fato sera DISPARADO
    // (aqui estamos apenas registrando ele)

    const aggregate = CustomAggregate.create()
    // Criando uma resposta porem SEM salvar no banco

    // Estou assegurando que o evento foi criado porem NÃO foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    DomainEvents.dispatchEventsForAggregate(aggregate.id)
    // aqui estamos de fato DISPARANDO(salvando a resposta no bd) o evento(entao agora a callbackSpy foi chamada)
    // isso é basicamente o que acontecerá de fato; o banco notificará que o evento está ready pra ser disparado
    // então, usamos essa função pra de fato disparar o evento

    expect(callbackSpy).toHaveBeenCalled()
    // e ai no vitest temos literalmente um metodo toHaveBeenCalled, justamente pra saber se a fn
    // foi chamada ou nao(ta no nome, é uma function que espia/verifica/nos avisa)
    // o subscriber ouve o evento e faz o que precisa ser feito com o dado

    expect(aggregate.domainEvents).toHaveLength(0)
    // esperamos que minha lista de domainEvents seja 0, pois criamos apenas um, e este ja foi disparado(logo, ele sai da lista)
    // nesta lista ficariam apenas os que nao estam ready ainda(foram apenas registrados)
  })
})
