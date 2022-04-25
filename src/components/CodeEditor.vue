<template>
    <div ref="editor" style="width:100%;height:100%;"></div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export default {
    name: 'CodeEditor',
    props: {
        value: String,
        lang: String,
        theme: String
    },

    data() {
        return {
            currentValue: ''
        }
    },

    mounted() {
        const editor = monaco.editor.create(this.$refs.editor, {
            value: this.value || '',
            language: this.lang || 'html',
            theme: this.theme || 'vs-dark',

            fontSize: 20,

            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true
        })
        editor.getModel().onDidChangeContent(() => {
            this.currentValue = editor.getValue()
            this.$emit('change', { value: this.currentValue })
        })
        editor.layout()
    },

    methods: {
        getValue() {
            return this.currentValue
        }
    }
}
</script>

<style lang="scss">
.monaco-editor {
    width: 100% !important;
    height: 400px !important;
    overflow-y: scroll;
}
</style>