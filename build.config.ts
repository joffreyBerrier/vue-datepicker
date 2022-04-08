import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: false,
  },
  entries: [
    { input: "src/index" },
    { input: "src/components", outDir: "dist/components", builder: "mkdist" },
  ],
})
