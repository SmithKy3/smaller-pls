const Path = require('path');
const Bundler = require('parcel-bundler');
const { exec } = require("child_process");

const entryFile = Path.join(__dirname, './src/index.ts');

const options = {
    outDir: './dist',
    outFile: 'index.js',
    cache: false,
    minify: false,
    target: 'browser',
    bundleNodeModules: false,
    logLevel: 0,
    sourceMaps: true,
};

(async function () {
    exec('tsc --emitDeclarationOnly');
    const bundler = new Bundler(entryFile, options);
    await bundler.bundle();
    process.exit();
})();