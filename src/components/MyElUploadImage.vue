<template>
    <el-upload
            class="avatar-uploader"
            action="./cas/common/uploadimage"
            v-loading="isimageupload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            ref="upload"
    >
        <img
                v-if="avatar"
                :src="Urkl"
                class="avatar"
        />
        <i v-else class="el-icon-upload add"></i>
    </el-upload>
</template>

<script>
import {getImage} from "@/api/common";

export default {
    name: "MyElUploadImage",
    props: {
        avatar: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            Urkl:require('@/assets/image.jpg'),
            isimageupload: false,//图片是否再上传
        }
    },
    watch:{
        async 'avatar'(newa, olds) {
            console.log(olds)
            const data = await this.handelAvatar(newa)
            console.log(data)

            if (data !== '') {
                this.Urkl = data
            }
        }
    },
    async created() {
        const data = await this.handelAvatar(this.avatar)
        console.log(data)

        if (data !== '') {
            this.Urkl = data
        }
    },
    methods: {
         async handelAvatar(q) {
             if (!q.includes("http")) {
                 const res = await getImage(q)
                 if (String(res.code) === '1') {
                     return String(res.data);
                 }
                 console.log(res)

                 return '';
             }
             console.log(q)
             return q;
         },
        handleAvatarSuccess(res) {
            this.isimageupload = false;
            if (String(res.code) === '1') {
                this.$emit("update:avatar", String(res.data));
            } else {
                this.$message.error(res.msg)
            }

        },
        beforeAvatarUpload(file) {
            this.isimageupload = true
            const suffix = file.name.split('.')[1]
            if (!['png', 'jpeg', 'jpg'].includes(String(suffix))) {
                this.$message.error('上传图片只支持 png、jpeg、jpg 格式！')
                this.isimageupload = false;
                return false
            }
        },
    }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .add {
    width: 100px;
    height: 100px;
    line-height: 100px;
    font-size: 28px;
    text-align: center;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

</style>