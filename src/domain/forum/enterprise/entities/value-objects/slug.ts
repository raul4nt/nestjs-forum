// value object -> abstrai regra de negocio de um unico campo
// da nossa entidade em uma classe e/ou arquivo separado

export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(slug: string) {
    return new Slug(slug)
  }

  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      // normalize remove qualquer tipo de acentuação da string
      // e retorna a string sem acentuação
      .toLowerCase()
      // converte a string para minúsculas
      .trim()
      // tira espaços em branco da esquerda e da direita da string
      .replace(/\s+/g, '-')
      // substitui qualquer sequência de espaços (um ou mais) por um hífen (-)
      .replace(/[^\w-]+/g, '')
      // remove qualquer caractere que não seja uma letra, número ou hífen
      .replace(/_/g, '-')
      // substitui o caractere de sublinhado (_) por hífen (-)
      .replace(/--+/g, '-')
      // substitui qualquer sequência de hífens consecutivos (dois ou mais) por um único hífen
      .replace(/-$/g, '')
    // remove um hífen no final da string, caso exista

    return new Slug(slugText)
  }
}
