// importa a classe base WatchedList para ser usada no teste
import { WatchedList } from './watched-list'

// cria uma classe que estende WatchedList para lidar com números
class NumberWatchedList extends WatchedList<number> {
  // implementa o método compareItems para comparar dois números
  compareItems(a: number, b: number): boolean {
    return a === b // retorna verdadeiro se os números forem iguais
  }
}

// inicia o bloco de testes para a classe WatchedList
describe('watched list', () => {
  // primeiro teste: criar uma lista observada com itens iniciais
  it('should be able to create a watched list with initial items', () => {
    // cria uma lista com os números [1, 2, 3]
    const list = new NumberWatchedList([1, 2, 3])

    // verifica se a lista foi criada com exatamente 3 itens
    expect(list.currentItems).toHaveLength(3)
  })

  // segundo teste: adicionar um novo item à lista
  it('should be able to add new items to the list', () => {
    const list = new NumberWatchedList([1, 2, 3]) // cria a lista inicial

    list.add(4) // adiciona o número 4 à lista

    // verifica se agora a lista tem 4 itens
    expect(list.currentItems).toHaveLength(4)
    // verifica se o item 4 foi adicionado à lista de novos itens
    expect(list.getNewItems()).toEqual([4])
  })

  // terceiro teste: remover um item da lista
  it('should be able to remove items from the list', () => {
    const list = new NumberWatchedList([1, 2, 3]) // cria a lista inicial

    list.remove(2) // remove o número 2 da lista

    // verifica se a lista agora tem 2 itens
    expect(list.currentItems).toHaveLength(2)
    // verifica se o item 2 foi adicionado à lista de removidos
    expect(list.getRemovedItems()).toEqual([2])
  })

  // quarto teste: adicionar um item mesmo que ele tenha sido removido antes
  it('should be able to add an item even if it was removed before', () => {
    const list = new NumberWatchedList([1, 2, 3]) // cria a lista inicial

    list.remove(2) // remove o número 2
    list.add(2) // adiciona novamente o número 2

    // verifica se a lista ainda tem 3 itens
    expect(list.currentItems).toHaveLength(3)

    // verifica se a lista de removidos está vazia, já que o item foi readicionado
    expect(list.getRemovedItems()).toEqual([])
    // verifica se a lista de novos itens também está vazia, pois o item já existia antes
    expect(list.getNewItems()).toEqual([])
  })

  // quinto teste: remover um item mesmo que ele tenha sido adicionado antes
  it('should be able to remove an item even if it was added before', () => {
    const list = new NumberWatchedList([1, 2, 3]) // cria a lista inicial

    list.add(4) // adiciona o número 4
    list.remove(4) // remove o número 4 logo depois

    // verifica se a lista ainda tem 3 itens (pois o 4 foi removido)
    expect(list.currentItems).toHaveLength(3)

    // verifica se a lista de removidos está vazia, já que o item nunca esteve na lista inicial
    expect(list.getRemovedItems()).toEqual([])
    // verifica se a lista de novos itens também está vazia, pois o item foi adicionado e removido logo depois
    expect(list.getNewItems()).toEqual([])
  })

  // sexto teste: atualizar os itens da lista e verificar as mudanças
  it('should be able to update watched list items', () => {
    const list = new NumberWatchedList([1, 2, 3]) // cria a lista inicial

    list.update([1, 3, 5]) // atualiza a lista para conter [1, 3, 5]

    // verifica se o item 2 foi detectado como removido
    expect(list.getRemovedItems()).toEqual([2])
    // verifica se o item 5 foi detectado como novo
    expect(list.getNewItems()).toEqual([5])
  })
})
