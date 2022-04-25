<template>
	<router-view></router-view>
</template>

<script>
export default {
	name: 'App'
}
</script>

<style lang="scss">
@import url('./assets/css/theme.scss');

*,*::before,*::after {
	padding: 0;
	margin: 0;
	
	font-family: inherit;

	text-decoration: none;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	box-sizing: border-box;

	color: inherit;
}
body,html,#app {
	width: 100vw;
	height: 100vh;

	overflow: hidden;
}

#app {
	font-family: 'Inter', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	background-color: var(--color-basic);
	color: var(--text-basic);
}
</style>
