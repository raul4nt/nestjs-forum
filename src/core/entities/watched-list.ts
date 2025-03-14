// define uma classe abstrata chamada WatchedList que pode armazenar elementos do tipo T
export abstract class WatchedList<T> {
  // array que contém os itens atuais da lista
  public currentItems: T[]
  // array que guarda os itens iniciais para referência
  private initial: T[]
  // array para armazenar novos itens adicionados após a criação da lista
  private new: T[]
  // array que mantém os itens que foram removidos da lista
  private removed: T[]

  // construtor que recebe uma lista inicial de itens (opcional)
  constructor(initialItems?: T[]) {
    // se não houver itens iniciais, a lista começa vazia
    this.currentItems = initialItems || []
    this.initial = initialItems || []
    this.new = [] // começa vazia, pois ainda não há itens novos
    this.removed = [] // começa vazia, pois nenhum item foi removido
  }

  // método abstrato que precisa ser implementado nas classes filhas
  // ele define como comparar dois itens do tipo T
  abstract compareItems(a: T, b: T): boolean

  // retorna todos os itens atuais da lista
  public getItems(): T[] {
    return this.currentItems
  }

  // retorna os itens que foram adicionados após a criação da lista
  public getNewItems(): T[] {
    return this.new
  }

  // retorna os itens que foram removidos da lista
  public getRemovedItems(): T[] {
    return this.removed
  }

  // verifica se um item já está na lista atual
  private isCurrentItem(item: T): boolean {
    return (
      this.currentItems.filter((v: T) => this.compareItems(item, v)).length !==
      0
    )
  }

  // verifica se um item está na lista de novos itens
  private isNewItem(item: T): boolean {
    return this.new.filter((v: T) => this.compareItems(item, v)).length !== 0
  }

  // verifica se um item está na lista de removidos
  private isRemovedItem(item: T): boolean {
    return (
      this.removed.filter((v: T) => this.compareItems(item, v)).length !== 0
    )
  }

  // remove um item da lista de novos itens
  private removeFromNew(item: T): void {
    this.new = this.new.filter((v) => !this.compareItems(v, item))
  }

  // remove um item da lista atual
  private removeFromCurrent(item: T): void {
    this.currentItems = this.currentItems.filter(
      (v) => !this.compareItems(item, v),
    )
  }

  // remove um item da lista de removidos
  private removeFromRemoved(item: T): void {
    this.removed = this.removed.filter((v) => !this.compareItems(item, v))
  }

  // verifica se um item estava na lista inicial
  private wasAddedInitially(item: T): boolean {
    return (
      this.initial.filter((v: T) => this.compareItems(item, v)).length !== 0
    )
  }

  // verifica se um item existe na lista atual
  public exists(item: T): boolean {
    return this.isCurrentItem(item)
  }

  // adiciona um item na lista
  public add(item: T): void {
    // se o item estava na lista de removidos, remove de lá
    if (this.isRemovedItem(item)) {
      this.removeFromRemoved(item)
    }

    // se o item não está na lista de novos e não estava na lista inicial, adiciona como novo
    if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
      this.new.push(item)
    }

    // se o item ainda não está na lista atual, adiciona
    if (!this.isCurrentItem(item)) {
      this.currentItems.push(item)
    }
  }

  // remove um item da lista
  public remove(item: T): void {
    // primeiro, remove o item da lista atual
    this.removeFromCurrent(item)

    // se o item está na lista de novos, remove também da lista de novos
    if (this.isNewItem(item)) {
      this.removeFromNew(item)
      return // não precisa adicionar à lista de removidos nesse caso
    }

    // se o item não está na lista de removidos, adiciona lá
    if (!this.isRemovedItem(item)) {
      this.removed.push(item)
    }
  }

  // atualiza a lista com novos itens, recalculando os adicionados e removidos
  public update(items: T[]): void {
    // encontra os itens que são novos na lista
    const newItems = items.filter((a) => {
      return !this.getItems().some((b) => this.compareItems(a, b))
    })

    // encontra os itens que foram removidos da lista
    const removedItems = this.getItems().filter((a) => {
      return !items.some((b) => this.compareItems(a, b))
    })

    // atualiza as listas internas
    this.currentItems = items
    this.new = newItems
    this.removed = removedItems
  }
}
