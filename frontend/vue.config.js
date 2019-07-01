const path = require("path");

module.exports = {
    publicPath: '',
    outputDir: path.resolve(__dirname, "../dist"),
    assetsDir: 'static',
    pwa: {
        name: 'Materia',
        themeColor: '#0097a7',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',

        // configure the workbox plugin
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: 'src/service-worker.js'
        }
    }
}