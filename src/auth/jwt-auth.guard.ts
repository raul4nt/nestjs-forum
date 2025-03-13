import { AuthGuard } from '@nestjs/passport'

export class JwtAuthGuard extends AuthGuard('jwt') {}
// classe base para usarmos nosso guard com um nome personalizado
