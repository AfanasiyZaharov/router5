import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import nodeResolve from 'rollup-plugin-node-resolve'
import common from 'rollup-plugin-commonjs'

const babelOptions = {
    runtimeHelpers: true,
    presets: [['env', { modules: false }], 'react'],
    plugins: [
        'external-helpers',
        'transform-object-rest-spread',
        'transform-class-properties',
        'transform-export-extensions'
    ],
    babelrc: false
}

const modules = {
    router5: 'packages/router5/modules/index.js'
}

const modulesToBuild = Object.keys(modules).reduce((acc, moduleName) => {
    const base = {
        input: modules[moduleName]
    }
    const packageDir = modules[moduleName].match(/^packages\/([\w-]+)\//)[1]
    const plugins = [
        nodeResolve({ jsnext: true, module: true }),
        common({ include: `packages/${packageDir}/node_modules/**` }),
        babel(babelOptions)
    ]

    return acc.concat([
        Object.assign({}, base, {
            output: {
                file: `dist/${moduleName}.js`,
                name: moduleName,
                format: 'umd'
            },
            plugins
        }),
        Object.assign({}, base, {
            output: {
                file: `dist/${moduleName}.min.js`,
                name: moduleName,
                format: 'umd'
            },
            plugins: plugins.concat(uglify())
        })
    ])
}, [])

export default modulesToBuild
