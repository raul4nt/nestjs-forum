import { hash, compare } from 'bcryptjs'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

// esta é a implementaçao REAL da criptografia da aplicaçao(por isso o nome, BcryptHasher)

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8
  // passando o salt dessa maneira para caso queiramos mudar pra outro salt a gente mude diretamente
  // atraves dessa constante/variavel

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
