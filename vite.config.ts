import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPAths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPAths()],
})
