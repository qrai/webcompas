const { defineConfig } = require('@vue/cli-service')

const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = defineConfig({
	transpileDependencies: true,
	chainWebpack: config => {
		config.plugin('monaco-editor').use(MonacoEditorPlugin, [
			{
				languages: ['javascript', 'html', 'css']
			}
		])
	}
})