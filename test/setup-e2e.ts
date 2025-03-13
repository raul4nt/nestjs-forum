import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

// arquivo feito pra setar(setup) nosso ambiente exclusivo pra testse e2e

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
    // essa funçao sera usada pra gerar um database_url novo mudando a parte do schema?(parm) pra outro schema(coisa util do postgres)
    // assim podemos usar o mesmo banco mas o schema é uma replica dele, criamos uma replica exclusiva na hora de testar e depois apagamos ela
  }

  const url = new URL(process.env.DATABASE_URL)
  // pegamos o DATABASE_URL do .env

  url.searchParams.set('schema', schemaId)
  // setamos o param schema para o novo schema que passaremos como parametro(randomUUID)

  return url.toString()
  // retornamos como string
}

const schemaId = randomUUID()
// aqui geramos nosso id unico pro schema

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL
  // antes de cada teste a gente gera um novo id aleatorio(novo DATABASE_URL) pra usar um schema isolado pros testes

  execSync('npx prisma migrate deploy')
  // usamos o migrate deploy ao inves do migrate dev pq o deploy só roda as migrations no banco, nao fica fazendo verificaçoes
  // ou seja, só roda as migrations e deu
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect
  // depois de efetuados os testes, dropamos o schema(excluimos/destruimos) e usamos o cascade tb pra deletar qualquer referencia a ele
  // que possa ter ficado
})
