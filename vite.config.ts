import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js','.mjs', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      "root": path.resolve(__dirname, "./src"),
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
})

