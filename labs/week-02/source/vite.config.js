import { defineConfig } from 'vite'

const repositoryName = "kamonwan-reanu/engse203-student-labs-68543210060-8";

export default defineConfig({
  base: `/${repositoryName}/labs/week-02/`,
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});