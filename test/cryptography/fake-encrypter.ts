import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'

// esta classe é um stub -> um stub é uma implementação fictícia de um contrato, usado para testes
// neste caso temos um fake encrypt method que vai simplesmente converter uma string pra JSON(ao inves de gerar um acessToken)

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
