/**
 * Tornar algumas propriedades de um tipo opcionais
 *
 * @example
 * ```typescript
 * type Post {
 *  id: string;
 *  name: string;
 *  email: string;
 * }
 *
 * Optional<Post, 'id' | 'email'>
 * ```
 * Nesse exemplo, estamos tornando as propriedades 'id' e 'email' do tipo `Post` opcionais.
 **/

// Definição do tipo genérico Optional
export type Optional<T, K extends keyof T> =
  // 1. Pick<Partial<T>, K>: Primeiro, torna as propriedades de T (definidas em K) opcionais
  // Isso significa que para 'id' e 'email', vamos ter tipos opcionais
  Pick<Partial<T>, K> &
    // 2. Omit<T, K>: Depois, usamos Omit para pegar todas as propriedades de T
    // EXCETO aquelas que estão em K ('id' e 'email', neste caso)
    Omit<T, K>
