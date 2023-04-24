<template>
    <div class="sdss" id="invitecode-management">
        <div class="container">
            <div class="tableBar">
                <el-input
                        v-model="input"
                        disabled="false"
                        placeholder="请输入邀请码昵称"
                        style="width: 250px"
                        clearable
                        @clear="cleanQuery"
                        @keyup.enter.native="handleQuery"
                >
                    <i
                            slot="prefix"
                            class="el-input__icon el-icon-search"
                            style="cursor: pointer"
                            @click="init"
                    ></i>
                </el-input>
                <div class="tableLab">
                    <span class="span-btn delBut non" @click="deleteHandle('批量', null)">批量删除</span>
                    <el-button
                            type="primary"
                            @click="addInviteCodetype('add')"
                    >
                        + 增加邀请码
                    </el-button>
                </div>
            </div>
            <el-table
                    :data="tableData"
                    stripe
                    class="tableBox"
                    v-loading="usertableloading"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column
                        type="selection"
                        width="50"
                ></el-table-column>
                <el-table-column
                        prop="inviteCode"
                        sortable
                        label="邀请码"
                        width="300"
                ></el-table-column>
                <el-table-column
                        prop="persistence"
                        label="多次使用"
                        sortable
                        width="150"
                >
                    <template slot-scope="{ row }">
                        <span v-if="String(row.persistence)==='1'">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>

                <el-table-column
                        prop="usageCount"
                        sortable
                        label="已使用次数"
                        width="100"
                >
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        sortable
                        label="创建时间"
                >
                </el-table-column>
                <el-table-column
                        prop="createUserName"
                        label="创建用户"
                >
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="160"
                        align="center"
                        fixed="right"
                >
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                size="small"
                                class="delBut non"
                                :disabled="scope.row.id==1"
                                @click="deleteHandle('单删', scope.row.id)"
                        >
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="[5, 10, 20, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="counts">
            </el-pagination>
            <div>
                <el-dialog
                        :title="classData.title"
                        :visible.sync="classData.dialogVisible"
                        width="40%"
                        :show-close="false"
                        :close-on-click-modal="false"
                        :close-on-press-escape="false"
                        :append-to-body="true"
                        style="z-index: 2100"
                >
                    <el-form
                            ref="classData"
                            :model="classData"
                            :rules="rules"
                            :inline="true"
                            label-width="180px"
                            class="demo-classData"
                    >
                        <div>
                            <el-form-item
                                    label="生成条数:"
                            >
                                <el-input
                                        v-model="classData.numberOfLines"
                                        placeholder="请填写邀请码生成条数"
                                        type="number"
                                        maxlength="2"
                                />
                            </el-form-item>
                            <el-form-item label="邀请码限制：">
                                <el-select v-model="classData.persistence" placeholder="请选择邀请码限制">
                                    <el-option
                                            v-for="item in persistenceoptions"
                                            :key="item.label"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>


                        <div>
                        </div>


                    </el-form>

                    <span
                            slot="footer"
                            class="dialog-footer"
                    >
                <el-button
                        size="medium"
                        @click="cancel()"
                >取 消</el-button>
                <el-button
                        type="primary"
                        size="medium"
                        @click="submitForm()"
                >生成</el-button>
          </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import router from "@/router";
import {
    addInviteCodeList,
    addInviteCodeOne,
    delInviteCodeList,
    delInviteCodeOne,
    getSelfInviteCodeList
} from "@/api/invitecode";
export default {
    name: "InviteCode",
    data() {
        return {

            input: '',
            counts: 0,
            page: 1,
            pageSize: 5,
            tableData : [],
            checkList: [],
            usertableloading:false,
            userInfo: {},
            token:'',
            isAdmin:false,
            persistenceoptions:[{label:"多次使用",value:1},{label:"单次销毁",value:0}],
            classData: {
                id:'',//id
                title: '新建邀请码',
                dialogVisible: false,
                numberOfLines: 1,
                persistence:0,//默认为邀请码
            },
            inputStyle  : {'flex':1},
        }
    },
    watch:{
        'classData.numberOfLines':{
            handler(val1,val2){
                if (val1<1){
                    this.classData.numberOfLines = val2
                }
            }
        }
    },
    computed: {
        rules () {
            return {
                'persistence': [
                    {'required': true, 'message': '请选择邀请码限制', 'trigger': ['change']}
                ],
                'numberOfLines': [
                    {'required': true, 'message': '请输入生成条数', 'trigger': ['change']}
                ],
            }
        }
    },
    created() {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.token = localStorage.getItem('token')
        const userInfo = window.localStorage.getItem('userInfo')
        if (userInfo){
            if (String(this.userInfo.permission)==='10'||String(this.userInfo.permission)==='1'){
                this.isAdmin = true
                this.init()
            }else {
                this.isAdmin = false
                router.push({path:"/404"})
            }
        }else {
            router.push({path:"/404"})
        }
    },
    mounted() {
    },
    methods: {

        async init () {
            this.usertableloading = true
            let params = {}
            params.pageNum = this.page
            params.pageSize = this.pageSize
            // if (this.input){
            //     params.name = this.input ? this.input : undefined
            // }
            const res = await getSelfInviteCodeList(params)
            console.log(res)
            if (String(res.code) === '1') {
                this.tableData = res.data.records || []
                this.counts = Number(res.data.total)
            }else {
                this.$message.error('请求出错了：' + res.msg)
            }
            this.usertableloading = false

        },
        handleQuery() {
            this.page = 1;
            this.init();
        },
        cleanQuery(){
            this.page = 1;
            this.input = undefined
            this.init()
        },
        // 添加
        addInviteCodetype (st) {
            if (st === 'add'){
                this.action = 'add'
                this.cleanform()
                this.classData.title = '新增邀请码'
                this.classData.dialogVisible = true
            }
        },
        // 删除
        deleteHandle (type, id) {
            let params = {}
            if (type === '批量' && id === null) {
                if (this.checkList.length === 0) {
                    return this.$message.error('请选择删除对象')
                }
            }
            if (type === '批量'){
                params.id = this.checkList.join(',')
                this.$confirm('确认删除该邀请码, 是否继续?', '确定删除', {
                    'confirmButtonText': '确定',
                    'cancelButtonText': '取消',
                }).then(async () => {
                    const res = await delInviteCodeList(params)
                    if (String(res.code)==='1'){
                        this.$message.success(res.msg)
                        this.handleQuery()
                    }else {
                        this.$message.error(res.msg || '操作失败')
                    }
                })
            }else {
                params.id = id
                this.$confirm('确认删除该邀请码, 是否继续?', '确定删除', {
                    'confirmButtonText': '确定',
                    'cancelButtonText': '取消',
                }).then(async () => {
                    const res = await delInviteCodeOne(params)
                    if (String(res.code)==='1'){
                        this.$message.success(res.msg)
                        this.handleQuery()
                    }else {
                        this.$message.error(res.msg || '操作失败')
                    }
                })
            }



        },

        // 全部操作
        handleSelectionChange (val){
            let checkArr = []
            val.forEach((n) => {
                checkArr.push(n.id)
            })
            this.checkList = checkArr
        },
        handleSizeChange (val) {
            console.log(val)
            this.pageSize = val
            this.init()
        },
        handleCurrentChange (val) {
            if (val>(Number(this.counts)/Number(this.pageSize))+1){
                this.$message.info("最大页了")
                return
            }
            this.page = val
            this.init()
        },
        cleanform(){

            if (this.classData.numberOfLines) {
                this.classData.numberOfLines = 1
            }
            if (this.classData.persistence) {
                this.classData.persistence = 0
            }
        },

        cancel(){
            this.cleanform()
            this.classData.dialogVisible = false
        },

        async submitForm() {
                //添加
                if (this.action==='add'){
                    this.$refs["classData"].validate(async (valid) => {  //开启校验
                        console.log(valid)
                        if (!valid) {   // 如果校验通过，请求接口，允许提交表单
                            return false;
                        } else {
                            let data = {}
                            console.log(this.classData)
                            if (String(this.classData.numberOfLines)==='') {
                                this.$message.error("请你输入完整")
                                return false;
                            }
                            if (String(this.classData.numberOfLines)==='') {
                                this.$message.error("请你输入完整")
                                return false;
                            }
                            data.persistence = Number(this.classData.persistence)

                            if (String(this.classData.numberOfLines)==='1'){

                                const res = await addInviteCodeOne(data)
                                if (String(res.code)==='1'){
                                    this.$message.success(res.msg)

                                    this.handleQuery()
                                    this.cancel()
                                    this.dialogVisible = false
                                }else {
                                    this.$message.error(res.msg)
                                }
                                console.log(res)
                            }else {
                                data.numberOfLines = Number(this.classData.numberOfLines)
                                const res = await addInviteCodeList(data)
                                if (String(res.code)==='1'){
                                    this.$message.success(res.msg)
                                    this.handleQuery()
                                    this.cancel()
                                    this.dialogVisible = false
                                }else {
                                    this.$message.error(res.msg)
                                }
                                console.log(res)
                            }

                        }
                    });
            }
        },
    }
}
</script>

<style>
.sdss {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    min-height: 35rem;
    padding: 1rem 1rem 1rem 1rem;
}

.selectInput {
    position: relative;
    width: 100%;
    min-width: 100px;
}
.selectInput .flavorSelect {
    position: absolute;
    width: 100%;
    padding: 0 10px;
    border-radius: 3px;
    border: solid 1px #807974;
    line-height: 30px;
    text-align: center;
    background: rgba(255, 255, 255, 0.98);
    top: 50px;
    z-index: 99;
}
.selectInput .flavorSelect .items {
    cursor: pointer;
    display: inline-block;
    width: 100%;
    line-height: 15px;
    /*border-bottom: solid 1px #a85151;*/
    /*color: #383737;*/
    /*padding: 1px 1px 1px 1px;*/
}
.selectInput .flavorSelect .none {
    font-size: 14px;
}
#invitecode-management .uploadImg .el-form-item__label::before{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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
.dashboard-container {
    padding: 20px;
}
.container {
    background: #fff;
    position: relative;
    z-index: 1;
    padding: 30px 28px;
    border-radius: 4px;
}
.container .tableBar {
    display: flex;
    margin-bottom: 20px;
    justify-content: space-between;
}
.container .tableBox {
    width: 100rem;
    border: solid 2px #f3f4f7;
    border-radius: 2px;
}
.container .tableBox .el-image img {
    width: 40px;
    border-radius: 5px;
}
.container .pageList {
    text-align: center;
    margin-top: 30px;
}
.tableLab .span-btn {
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    padding: 0 20px;
    color: #818693;
    border-right: solid 1px #d8dde3;
}
.container .tableLab .el-button {
    margin-left: 10px;
}
.el-table-column--selection .cell {
    padding-left: 10px;
}
/* 添加 */
.addBrand-container .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.addBrand-container .avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.addBrand-container .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 160px;
    line-height: 160px;
    text-align: center;
}
.addBrand-container .avatar {
    width: 160px;
    height: 160px;
    display: block;
}
.addBrand-container .el-form--inline .el-form-item__content {
    width: 293px;
}
.addBrand-container .el-input {
    width: 293px;
}
.addBrand-container {
    margin: 30px;
}
.addBrand-container .container {
    position: relative;
    z-index: 1;
    background: #fff;
    padding: 30px;
    border-radius: 4px;
    min-height: 500px;
}
.addBrand-container .container .subBox {
    padding-top: 30px;
    text-align: center;
    border-top: solid 1px #f3f4f7;
}
.flavorBox {
    width: 777px;
}
.flavorBox .addBut {
    background: #ffc200;
    display: inline-block;
    padding: 0px 20px;
    border-radius: 3px;
    line-height: 40px;
    cursor: pointer;
    border-radius: 4px;
    color: #333333;
    font-weight: 500;
}
.flavorBox .flavor {
    border: solid 1px #dfe2e8;
    border-radius: 3px;
    padding: 15px;
    background: #fafafb;
}
.flavorBox .flavor .title {
    color: #606168;
}
.flavorBox .flavor .cont .items {
    display: flex;
    margin: 10px 0;
}
.flavorBox .flavor .cont .items .itTit {
    width: 150px;
    margin-right: 15px;
}
.flavorBox .flavor .cont .items .itTit input {
    width: 100%;
    line-height: 40px;
    border-radius: 3px;
    padding: 0 10px;
}
.flavorBox .flavor .cont .items .labItems {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    border-radius: 3px;
    min-height: 39px;
    border: solid 1px #d8dde3;
    background: #fff;
    padding: 0 5px;
}
.flavorBox .flavor .cont .items .labItems span {
    display: inline-block;
    color: #f19c59;
    margin: 5px;
    line-height: 26px;
    height: 26px;
    padding: 0 10px;
    background: #fdf4eb;
    border-radius: 3px;
    border: solid 1px #fae2cd;
}
.flavorBox .flavor .cont .items .labItems span i {
    cursor: pointer;
    font-style: normal;
}
.flavorBox .flavor .cont .items .labItems .inputBox {
    display: inline-block;
    width: 100%;
    height: 36px;
    line-height: 36px;
    overflow: hidden;
}
.flavorBox .flavor .cont .items .delFlavor {
    display: inline-block;
    padding: 0 10px;
    color: #f19c59;
    cursor: pointer;
}
.addBrand-container .address .el-form-item__content {
    width: 777px !important;
}
.el-button--text {
    font-weight: 400 !important;
    font-size: 13px !important;
}
.el-table td {
    font-size: 13px !important;
}
.el-table .cell,
.el-table th div,
.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
    padding-left: 12px;
}
.xuanzeqi {
    padding: 5px 10px 5px 10px;
    margin: 0px 3px 15px 13px;
    /*border: rgba(162, 156, 156, 0.47) 1px solid;*/
    /*border-radius: 10px;*/
}

</style>