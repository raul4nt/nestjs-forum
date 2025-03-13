import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

// configuraçao que ta la na documentaçao do nestjs na aba de testing(só copy and paste)
// torna as configuraçoes/modulos do vitest globais e ajuda a localizar testes
// este temos que colocar um inclue pra especificar que sao apenas os arquivos terminados em
// e2e-spec.ts(testes end to end)

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
    // arquivo que sera chamado antes de cada arquivo de teste e2e
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      // swc torna mais rapido o vitest(ele usa esmodule como default, mas o swc é mais rapido)
      module: { type: 'es6' },
    }),
  ],
})
