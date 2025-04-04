import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

// Criamos este serviço injetável para simplificar o acesso às variáveis de ambiente (Env).
// Ele permite chamar diretamente o EnvService sem precisar instanciar o ConfigService manualmente
// toda vez no constructor, deixando o código mais limpo e reutilizável.

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T) {
    return this.configService.get<T>(key, { infer: true })
  }
}
