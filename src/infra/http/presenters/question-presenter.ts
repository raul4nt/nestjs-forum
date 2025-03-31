import { Question } from '@/domain/forum/enterprise/entities/question'

// presenter -> converte/formata um dado de maneira que fique mais "apresentavel" pro front-end
// neste caso aqui da question, por exemplo, poderiamos ter uma versao dela com o content, e outra sem
// exemplo: se fossemos listar as perguntas no front, nao precisamos do content
// se fossemos mostrar ela em uma interface q queiramos mostrar o conteudo da pergunta, seria legal ter outro
// presenter com o content incluido

export class QuestionPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,
      bestAnswerId: question.bestAnswerId?.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
