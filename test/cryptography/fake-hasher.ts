import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

// esta classe é um stub -> um stub é uma implementação fictícia de um contrato, usado para testes
// neste caso temos o metodo hash que nao faz um hash de verdade, apenas adiciona algo ao nosso plain text
// e temos o compare q só compara se o plain text hasheado é igual ao proprio plain text concatenado com -hashed(q é oq o hash faria)

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
