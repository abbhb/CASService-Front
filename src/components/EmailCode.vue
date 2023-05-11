<template>
    <div style="display: flex;flex-direction: row;align-items: center;">
        <el-input
                style="margin-right: 5px"
                placeholder="验证码"
                v-model="code"
                clearable>
        </el-input>
        <el-tag v-if="status===0" type="info">未知</el-tag>
        <el-tag type="success" v-else-if="status===1">正确</el-tag>
        <el-tag v-else-if="status===2" type="danger">错误</el-tag>

    </div>

</template>

<script>
import {havaEmailCode} from "@/api/email";

export default {
    name: "EmailCode",
    props:{
        email:{
            default:''
        },
        code:{
            default:''
        }
    },
    data(){
        return{
            status:0,
        }
    },
    watch:{
        code(newsa){
            if (newsa.length===6){
                this.haveCode()
            }
            this.$emit('update:code',newsa)
        }
    },
    methods:{
        async haveCode() {
            const res = await havaEmailCode(this.email, this.code)
            console.log(res)
            if (String(res.code) === '1') {
                if (String(res.data) === '1') {
                    this.status = 1;
                } else if (String(res.data) === '0') {
                    this.status = 2;
                } else {
                    this.status = 0;
                    this.$message.error("正确与否,请规范您的行为,多次调用该接口可能造成封号!~v~")
                }
            } else {
                this.status = 0;
                this.$message.error("正确与否,请规范您的行为,多次调用该接口可能造成封号!0v0")
            }
        }
    }
}
</script>

<style scoped>

</style>