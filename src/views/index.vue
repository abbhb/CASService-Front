<template>
    <MainNavFrame>
        <router-view/>
    </MainNavFrame>
</template>

<script>
import MainNavFrame from "@/components/MainNavFrame.vue";

export default {
    name: 'index',
    components: {MainNavFrame},
    data() {
        return {};
    },
    created() {
    },
    methods: {}
};
</script>

<style lang="scss" scoped>
body {
  font-size: 14px;
  font-family: Inter, "-apple-system", BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "noto sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;

}


</style>