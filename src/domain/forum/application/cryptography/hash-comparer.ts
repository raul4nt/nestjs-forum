// LEMBRANDO QUE USAMOS CLASSES ABSTRATAS POR CAUSA DAQUELA LIMITAÇAO DO NESTJS
// SE NAO TIVESSE, SERIA INTERFACE

export abstract class HashComparer {
  abstract compare(plain: string, hash: string): Promise<boolean>
}
