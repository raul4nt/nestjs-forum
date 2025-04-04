import { Module } from '@nestjs/common'
import { EnvService } from './env.service'

// criamos um module especificamente para o env para podermos usar
// o env service de maneira mais clara

@Module({
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
