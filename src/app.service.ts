import { Injectable } from '@nestjs/common';

@Injectable()
// precisamos colocar o injectable pra dizer que esta classe(service) pode ser implementada em outro lugar
// (ser injetada em um controller)
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
