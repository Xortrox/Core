await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    naming: 'highliteCore.js',
});
