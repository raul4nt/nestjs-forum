import { PipeTransform, BadRequestException } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'
// essa biblioteca é pra basicamente deixar os erros do zod mais bonitinhos(legiveis, deixa diferente)

// pipes pelo o que eu entendi são estilo middleware mas pra validação de erro
// neste caso usamos uma pipe do Zod(que tem la na doc do NestJS) pra verificar
// se os dados vieram do jeito que a gente quer(de acordo com o schema)

export class ZodValidationPipe implements PipeTransform {
  // implementa a PipeTransform
  constructor(private schema: ZodSchema) {}
  // recebe um schema zod no construtor

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
      // tenta usar o parse pra ver se esta tudo ok
    } catch (error) {
      // e, se der problema, fazemos a tratativa de erro por aqui mesmo
      if (error instanceof ZodError) {
        // se o erro for um erro do Zod, mostramos isso
        throw new BadRequestException({
          message: 'Validation failed',
          // msg personalizda de erro
          statusCode: 400,
          // statusCode que queremos mostrar(aparecerá em json na resposta)
          errors: fromZodError(error),
          // erro especifico que aconteceu usando o fromZodError pra deixar mais formatadinho
        })
      }

      throw new BadRequestException('Validation failed')
    }
    return value
  }
}
