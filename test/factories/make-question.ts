import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
  // pra dar a opçao de colocar um id, se quisermos
) {
  // partial vai tornar qualquer coisa de dentro do QuestionProps como
  // opcional, ou seja, recebo no override justamente isso(pra tornar opcional)
  // recebo qualquer prop de QuestionProps mas ela serao opcionais
  const question = Question.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      // gera um titulo fake(lorem) em sentença(ate 10 palavras)
      slug: Slug.create('example-question'),
      content: faker.lorem.text(),
      // gera um conteudo fake(lorem) em texto(string comprida)
      ...override,
      // ou seja, este override serve para eu sobrescrever alguma prop
      // assim, elas nao ficam estaticas, e eu posso mudar ela em um teste,
      // por exemplo
    },
    id,
    // se colocarmos, id vira aqui
    // se nao colocarmos, la na nossa classe entity ja temos um gerador
    // de id(pra caso nao passarmos um aqui)
  )

  return question
}
