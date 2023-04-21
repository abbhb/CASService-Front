<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>


export default {
    created() {

        if (this.$globl.isNeedZoom){
            if (document.body.style.zoom!=0.9){
                document.body.style.zoom = 0.9
            }
        }
    }
};
</script>

<style lang="scss">
#app {
  height: 100%;
  margin: 0;
}
body,
html {
  height: 100%;
  width: 100%;
  margin: 0 0 0 0;
}
</style>
