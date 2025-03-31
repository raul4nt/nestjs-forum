import { Question as PrismaQuestion, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

// mapper -> converte a formataçao de uma camada de dominio para outra
// temos o objeto quesiton do nosso dominio, e tb temos o nosso objeto question do bd(prisma)
// eles podem ate significar a mesma coisa, mas falando de grosso modo eles tem "formataçoes" diferentes
// o mapper faz justamente essa conversão de um pra outro de modo q possamos usar em diferentes camadas de dominio(conversao)

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}

// undefined vs null -> undefined é INEXISTENTE, não existe isso, e null é que "existe" mas não está preenchido
