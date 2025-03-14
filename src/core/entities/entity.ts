import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<Props> {
  // esse <Props> serve pra passarmos algo como "parametro"
  // pra dentro do entity. neste caso, passaremos as interfaces de propriedades
  // ou seja, InstructorProps, StudentProps, com as suas props devidamente preenchidas
  // ex: name: string, content: string
  private _id: UniqueEntityID
  // id será do tipo UniqueEntityID(classe unica pra criaçao do id)
  protected props: Props // tipamos a prop props pras Props que teremos lá
  // na interface

  get id() {
    return this._id
    // metódo get pra acessarmos o id do nosso objeto
  }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    // já inicializa o construtor pra gente com as props da interface
    this._id = id ?? new UniqueEntityID()
    // e tambem gera o id usando a classe UniqueEntityID(objeto)
    // se nao houver
  }

  // método pra verificar se duas entidades são iguais
  public equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true
      // se a entidade for igual a do parametro é true
    }

    if (entity.id === this._id) {
      return true
      // se o id for igual tb
    }

    return false
    // se nenhum dos dois for verdade, é false
  }
}
