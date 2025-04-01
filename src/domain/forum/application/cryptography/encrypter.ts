// LEMBRANDO QUE USAMOS CLASSES ABSTRATAS POR CAUSA DAQUELA LIMITÇAO DO NESTJS SE NAO TIVESSE, SERIA INTERFACEA

export abstract class Encrypter {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
