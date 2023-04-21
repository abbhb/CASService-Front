<template>
    <MainNavFrame>
        <div class="bodybody">
            <div class="notfound">
                <div>
                    <el-image class="img" src="./images/failed.png"></el-image>
                </div>

                <div class="content">
                    <h3>出错啦！该网站无法访问!</h3>
                    <div style="display: block;
        font-size: .8em;margin-top: 12px;">
                        (地址：{{ address }}，错误代码：{{ type }})
                    </div>
                </div>

            </div>
        </div>
    </MainNavFrame>
</template>

<script>
import MainNavFrame from "@/components/MainNavFrame.vue";

export default {
    name: "NotFound",
    components: {MainNavFrame},
    data() {
        return {
            address: '',
            type: '',
        }
    },
    created() {
        if (this.$route.query.address) {
            this.address = this.$route.query.address
        }
        if (this.$route.query.type) {
            this.type = this.$route.query.type
        }
    }
}
</script>

<style scoped>
.bodybody {
    background-color: #FFFFFF;
    display: block;
    -webkit-text-size-adjust: 100% !important;
    height: 38rem !important;
}

.bodybody .notfound {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    font-size: 1em;
    line-height: 1.6em;
    margin: 14vh auto 0;
    max-width: 600px;
    width: 100%;
    text-align: center;
}

.bodybody .notfound .img {
    width: 200px;
    height: 200px;
}

.bodybody .notfound .content {
    margin-top: 40px;
    color: #535353;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

}
</style>