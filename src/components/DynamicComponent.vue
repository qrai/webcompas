<template>
	<iframe 
		ref="componentHandler" 
		class="component-handler"

		sandbox="allow-same-origin allow-scripts"
	></iframe>
</template>

<script>
export default {
	name: 'DynamicComponent',

	data() {
		return {
			rootEl: null,
			styleEl: null,
			scriptEl: null,
		}
	},

	// Init
	mounted() {
		const iframe = this.$refs.componentHandler.contentDocument

		// Create root, style, script
		this.rootEl = iframe?.createElement('user-component')
		this.styleEl = iframe?.createElement('style')
		this.scriptEl = iframe?.createElement('script')
		this.scriptEl.setAttribute('type', 'text/javascript')

		// Create reset style
		const apiStyleEl = iframe.createElement('link')
		apiStyleEl.setAttribute('rel', 'stylesheet')
		apiStyleEl.setAttribute('href', process.env.BASE_URL + 'api/api.css')

		// Create debugger
		const apiDebugScriptEl = iframe.createElement('script')
		apiDebugScriptEl.innerHTML = `
		window.webcompas = {
			debug: [],
			debugListener: null
		}

		function ResetDebug() {
			window.webcompas.debug = []
			window.webcompas.debugListener(window.webcompas.debug)
		}
		function Debug(type, debugMsg) {
			if(debugMsg instanceof Error)
				window.webcompas.debug.push({ type: type, text: debugMsg.toString(), stack: debugMsg.stack })
			else
				window.webcompas.debug.push({ type: type, text: debugMsg })
			
			window.webcompas.debugListener(window.webcompas.debug)
		}
		
		function Action(f) {
			window.Component !== undefined ? f() : document.addEventListener('DOMContentLoaded', f)
		}
		`
		apiDebugScriptEl.setAttribute('type', 'text/javascript')

		// Create component definer
		const apiScriptEl = iframe.createElement('script')
		apiScriptEl.setAttribute('type', 'text/javascript')
		apiScriptEl.setAttribute('src', process.env.BASE_URL + 'api/api.js')

		// Append styles, scripts
		iframe.head.appendChild(apiStyleEl)
		iframe.head.appendChild(this.styleEl)
		iframe.head.appendChild(apiDebugScriptEl)
		iframe.head.appendChild(apiScriptEl)
		iframe.head.appendChild(this.scriptEl)

		// Append root
		iframe.body.appendChild(this.rootEl)

		const iframeWindow = this.$refs.componentHandler.contentWindow
		iframeWindow.webcompas.debugListener = (log) => this.$emit('log', log)
	},

	// Methods
	methods: {
		applyContent(html) {
			if(html && typeof html === 'string')
				this.rootEl.innerHTML = html
		},

		applyStyle(css) {
			if(css && typeof css === 'string')
				this.styleEl.innerHTML = css
		},

		applyScript(js) {
			if(js && typeof js === 'string') {
				const iframe = this.$refs.componentHandler.contentDocument

				// Remove old
				this.scriptEl.remove()

				// New script
				this.scriptEl = iframe?.createElement('script')
				this.scriptEl.setAttribute('type', 'text/javascript')
				this.scriptEl.innerHTML = `'use strict';try{Action(()=>{eval(\`${js}\`)})}catch(e){Debug('error',e)}`

				// Append new
				iframe.head.appendChild(this.scriptEl)
			}
		}
	}
}
</script>

<style scoped lang="scss">
.component-handler {
	margin: 0;
	padding: 0;

	display: block;

	border: none;
	outline: none;
}
</style>