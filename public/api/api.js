
function Component(options) {
	ResetDebug()

	function CheckOptions() {
		if(options)
			return true
		else {
			Debug('error', new Error('options not passed to Component'))
			return false
		}
	}
	function HasMethod(name) {
		return options && options[name] && typeof options[name] === 'function'
	}
	function Handle() {
		return window.webcompas.userComponent?.handle
	}

	// WebComponent
	if(!window.webcompas.userComponent) {
		customElements.define('user-component',
			class extends HTMLElement {
				constructor() {
					super()

					// Attach user handler
					this.handle = options

					// Defined
					window.webcompas.userComponent = this
				}

				connectedCallback() {
					Handle().mounted?.call(window.webcompas.userComponent)
				}
				disconnectedCallback() {
					Handle().destroyed?.call(window.webcompas.userComponent)
				}
			}
		)
	}
	
	// mount
	if(CheckOptions()) {
		if(HasMethod('mounted'))
			Handle().mounted?.call(window.webcompas.userComponent)
	}
}