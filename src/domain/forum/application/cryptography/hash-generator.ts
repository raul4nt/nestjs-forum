// LEMBRANDO QUE USAMOS CLASSES ABSTRATAS POR CAUSA DAQUELA LIMITAÇAO DO NESTJS
// SE NAO TIVESSE, SERIA INTERFACE

export abstract class HashGenerator {
  abstract hash(plain: string): Promise<string>
}
