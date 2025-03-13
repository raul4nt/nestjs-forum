import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'

import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  // aplicaçao nest(neste caso uma exclusiva pra nossa camada de testes)
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    // criamos de fato a aplicaçao nest nesta linha(tornar o app usavel)

    prisma = moduleRef.get(PrismaService)
    // referenciamos o prismaservice pra dentro da variavel prisma

    await app.init()
    // iniciamos o app
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      // método gethttpserver é util pra combinarmos com o uso do request do supertest justamente pra
      // simularmos uma rota pra um teste
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
      // conferimos se de fato o usuario foi criado procurando ele por um campo unico(unique)
    })

    expect(userOnDatabase).toBeTruthy()
    // se for truthy(nao falso) ta ok
  })
})
