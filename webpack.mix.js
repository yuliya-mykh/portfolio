const mix = require('laravel-mix');
const webpack = require('webpack');

mix.webpackConfig({
    module: {
        rules: [
            {
                test: /\.scss/,
                exclude: [/bower_components/, /node_modules/],
                loader: 'import-glob'
            },
            {
                test: /\.js/,
                exclude: [/bower_components/, /node_modules/],
                loader: 'import-glob'
            }
        ]
    },
    externals: {
        "jquery": "jQuery"
    },
    plugins: [
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: JSON.stringify(true),
            __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
        })
    ]
});

mix.autoload({jquery: ['$', 'window.jQuery']});
mix.sass('./scss/main.scss', './css/main.css');
mix.options({
    processCssUrls: false,
    postCss: [
        require('autoprefixer')({
            "overrideBrowserslist": [
                "> 1%",
                "ie >= 8",
                "edge >= 15",
                "ie_mob >= 10",
                "ff >= 45",
                "chrome >= 45",
                "safari >= 7",
                "opera >= 23",
                "ios >= 7",
                "android >= 4",
                "bb >= 10"
            ],
            grid: true
        })
    ]
});


// source maps in dev
if (!mix.inProduction()) {
    mix.webpackConfig({
        devtool: 'source-map'
    }).sourceMaps()
}
