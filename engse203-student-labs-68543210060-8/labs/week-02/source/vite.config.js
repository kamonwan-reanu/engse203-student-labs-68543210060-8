import { defineConfig } from 'vite'

const repositoryName = "engse203-suwimon-labs-68543210046-7";

export default defineConfig({
  base: `/${repositoryName}/labs/week-02/`,
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});