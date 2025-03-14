// either = ou um ou outro
// left - erro; right - sucesso;
// UI -> CONTROLLER -> CASO DE USO -> ENTIDADE -> CASO DE USO -> REPOSITORIO -> BANCO DE DADOS
// se der tudo certo, fluxo vai sempre pra direita
// se nao, left(erro)

// classe que representa um erro (left)
export class Left<L, R> {
  // propriedade que armazena o valor do erro
  readonly value: L

  // recebe o valor do erro no construtor e armazena na propriedade
  constructor(value: L) {
    this.value = value
  }

  // método que retorna false, pois um left nunca é um right (sucesso)
  isRight(): this is Right<L, R> {
    return false
  }

  // método que retorna true, pois esta instância é um left (erro)
  isLeft(): this is Left<L, R> {
    return true
  }
}

// classe que representa um sucesso (right)
export class Right<L, R> {
  // propriedade que armazena o valor do sucesso
  readonly value: R

  // recebe o valor do sucesso no construtor e armazena na propriedade
  constructor(value: R) {
    this.value = value
  }

  // método que retorna true, pois esta instância é um right (sucesso)
  isRight(): this is Right<L, R> {
    return true
  }

  // método que retorna false, pois um right nunca é um left (erro)
  isLeft(): this is Left<L, R> {
    return false
  }
}

// tipo Either que pode ser um Left (erro) ou um Right (sucesso)
export type Either<L, R> = Left<L, R> | Right<L, R>

// função auxiliar que cria um left (erro) a partir de um valor
export const left = <L, R>(value: L): Either<L, R> => {
  return new Left(value)
}

// função auxiliar que cria um right (sucesso) a partir de um valor
export const right = <L, R>(value: R): Either<L, R> => {
  return new Right(value)
}
