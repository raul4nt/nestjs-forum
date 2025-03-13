import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

// configuraçao que ta la na documentaçao do nestjs na aba de testing(só copy and paste)
// torna as configuraçoes/modulos do vitest globais e ajuda a localizar testes

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
