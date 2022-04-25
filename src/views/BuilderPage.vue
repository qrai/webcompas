<template>
    <div class="builder-container">
        <nav class="nav">
            <div class="nav-logo">
                <p>webcompas</p>
            </div>
            <button title="Export component" @click="save" class="nav-button right">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            </button>
            <button title="Preview component" @click="run" class="nav-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </button>
        </nav>

        <div class="content-container">
            <!--aside class="sidebar sidebar-left">

            </aside-->

            <div class="canvas">
                <DynamicComponent ref="component" @log="setLog" />

                <!--aside class="sidebar sidebar-right">
                    <p class="sidebar-title">Debug log</p>

                    <div ref="logContainer" class="log-container">
                        <div v-for="(message, index) of log" :key="index" :class="`log-message ${message.type}`">
                            {{ message.text }}
                        </div>
                    </div>
                </aside-->

                <div class="tabs-container" ref="tabsContainer">
                    <div class="tabs">
                        <button class="tab active" @click="switchTab('html')" data-tab="html">HTML</button>
                        <button class="tab" @click="switchTab('css')" data-tab="css">CSS</button>
                        <button class="tab" @click="switchTab('js')" data-tab="js">JS</button>
                    </div>
                    <div class="pages">
                        <div class="page visible" data-page="html">
                            <CodeEditor ref="htmlEditor" @change="htmlChange" :value="html" lang="html" />
                        </div>
                        <div class="page" data-page="css">
                            <CodeEditor ref="cssEditor" @change="cssChange" :value="css" lang="css" />
                        </div>
                        <div class="page" data-page="js">
                            <CodeEditor ref="jsEditor" @change="jsChange" :value="js" lang="javascript" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DynamicComponent from '../components/DynamicComponent.vue'
import CodeEditor from '../components/CodeEditor.vue'

export default {
    name: 'BuilderPage',

    components: { DynamicComponent, CodeEditor },

    data() {
        return {
            html: localStorage.getItem('WEBCOMPAS-CACHE-HTML') || `<div class="card">
    <p class="card-title">Title</p>
    <p class="card-text">Some text</p>
</div>`,
            css: localStorage.getItem('WEBCOMPAS-CACHE-CSS') || `.card {
    width: 100%;
    height: 100%;

    padding: 1.2rem 1.4rem;

    background-color: white;

    border: 1px solid #EEEEEE;
    border-radius: 25px;

    box-shadow: 8px 20px 50px rgba(0, 0, 0, 0.06);
}
p {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.card-title {
    font-weight: bold;
    font-size: 1.2rem;
    color: rgba(0, 0, 0, 1);
}
.card-text {
    color: rgba(0, 0, 0, .6);
}`,
            js: localStorage.getItem('WEBCOMPAS-CACHE-JS') || `Component({
    mounted() {

    },
    destroyed() {

    }
})`,

            log: []
        }
    },

    mounted() {
        // On unload
		window.addEventListener('beforeunload', (e) => { 
            console.log(this.html)
			localStorage.setItem('WEBCOMPAS-CACHE-HTML', this.html || '')
			localStorage.setItem('WEBCOMPAS-CACHE-CSS', this.css || '')
			localStorage.setItem('WEBCOMPAS-CACHE-JS', this.js || '')

			return false
		})

        this.$refs.component.applyContent(this.html)
        this.$refs.component.applyStyle(this.css)
        this.$refs.component.applyScript(this.js)
    },

    methods: {
        htmlChange(e) {
            this.html = e.value
        },
        cssChange(e) {
            this.css = e.value
        },
        jsChange(e) {
            this.js = e.value
        },

        switchTab(name) {
            // Tabs
            this.$refs.tabsContainer.querySelector('.tab.active').classList.remove('active')
            this.$refs.tabsContainer.querySelector(`.tab[data-tab="${name}"]`).classList.add('active')

            // Pages
            this.$refs.tabsContainer.querySelector('.page.visible').classList.remove('visible')
            this.$refs.tabsContainer.querySelector(`.page[data-page="${name}"]`).classList.add('visible')
        },

        save() {

        },

        run() {
            this.$refs.component.applyContent(this.$refs.htmlEditor.getValue())
            this.$refs.component.applyStyle(this.$refs.cssEditor.getValue())
            this.$refs.component.applyScript(this.$refs.jsEditor.getValue())
        },

        setLog(log) {
            this.log = log
        }
    }
}
</script>

<style lang="scss">
.builder-container {
    display: flex;
    flex-direction: column;

    .nav {
        height:  45px;

        display: flex;
        flex-direction: row;
        align-items: center;

        padding: .6rem 1.4rem;

        background-color: var(--color-dark);
        color: var(--text-dark);

        .right {
            margin-left: auto !important;
        }
        .nav-button {
            max-height: 25px;

            margin-left: 20px;

            background-color: transparent;
            color: var(--text-basic);
            opacity: 0.4;

            display: flex;
            justify-content: center;
            align-items: center;

            outline: none;
            border: none;

            cursor: pointer;

            transition: .2s ease-in-out;
            transition-property: color;

            &:hover {
                color: var(--text-basic);
            }
        }
    }
    .content-container {
        height: calc(100vh - 45px);

        display: grid;
        grid-template-columns: 250px 1fr 250px;
        .canvas {
            width: 100%;

            grid-column: 1 / 4;
            grid-row: 1 / 3;

            display: grid;
            grid-template-columns: 250px 1fr 250px;
            grid-template-rows: 1fr 450px;

            overflow: hidden;

            background-color: var(--color-secondary);

            .sidebar {
                width: 25vw;
                max-width: 250px;

                padding: .8rem 1.2rem;

                grid-column: auto;
                grid-row: 1;

                background-color: var(--color-panel);

                border-bottom: var(--border);

                &.sidebar-right {
                    grid-row: 1;
                    grid-column: 3;
                }

                .sidebar-title {
                    text-transform: uppercase;

                    color: var(--text-basic-muted);
                }
            }

            .component-handler {
                width: min-content;
                height: min-content;
                
                margin:  auto;

                grid-row: 1;
                grid-column: 1 / 4;

                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                overflow: scroll;
            }
            
            .tabs-container {
                width: 100%;
                height: 100%;

                grid-row: 2;
                grid-column: 1 / 4;

                justify-self: flex-end;

                display: flex;
                flex-direction: column;

                margin-top: auto;
            }
            .tabs-container .tabs {
                min-height: 3rem;

                display: flex;
                flex-direction: row;

                overflow-x: scroll;
                overflow-y: visible;

                background-color: var(--color-panel);
            }
            .tabs-container .tabs .tab {
                padding: 1rem 1.4rem;

                background-color: transparent;
                color: var(--text-basic-muted);

                font-weight: 500;
                font-size: 1rem;

                border: none;

                cursor: pointer;

                transition: .2s ease-in-out;
                transition-property: color;
            }
            .tabs-container .tabs .tab:hover {
                color: var(--text-basic);
            }
            .tabs-container .tabs .tab.active {
                background-color: var(--color-basic);
                color: var(--text-basic);
            }
            .tabs-container .pages {
                height: 100%;

                background-color: var(--color-basic);

                z-index: 100;
            }
            .tabs-container .pages .page {
                display: none;
                flex-direction: column;

                height: 100%;
            }
            .tabs-container .pages .page.visible {
                display: flex;
            }
        }
    }
}

.log-container {
    padding: .8rem 0;

    .log-message {
        max-height: 6rem;

        padding: .2rem .4rem;

        overflow: hidden;

        border-radius: 8px;

        &.log,&.info {
            color: #3ca7ff;
            background-color: #5bb6ea45;
        }
        &.error {
            color: #ff563c;
            background-color: #ea5b5b45;
        }
    }
}
</style>