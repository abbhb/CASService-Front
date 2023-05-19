<template>
<el-tooltip :placement="placement" :effect="effect">
    <div slot="content">
        {{text}}
        <slot></slot>
    </div>
    <i class="el-icon-question"/>
</el-tooltip>
</template>

<script>
export default {
    name: "HelpComponent",
    props: {
        text: {
            default: ''
        },
        placement: {
            default: 'left'
        },
        effect: {
            default: 'dark'
        }
    },
}
</script>

<style scoped>

</style>