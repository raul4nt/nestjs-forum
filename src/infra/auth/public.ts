import { SetMetadata } from '@nestjs/common'

// Definimos uma chave de metadado (`IS_PUBLIC_KEY`) para indicar que uma rota é pública.
// Em vez de aplicar `@UseGuards` manualmente para todas as rotas privadas,
// utilizamos o decorador `@Public`, permitindo marcar apenas as exceções (rotas públicas).
// Isso simplifica a lógica de autenticação e deixa o código mais limpo.
export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
