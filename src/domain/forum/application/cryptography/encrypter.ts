// LEMBRANDO QUE USAMOS CLASSES ABSTRATAS POR CAUSA DAQUELA LIMITAÇAO DO NESTJS SE NAO TIVESSE, SERIA INTERFACE

export abstract class Encrypter {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
