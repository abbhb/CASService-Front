<template>
    <div class="sdss" id="Oauth-management">
        <div class="container">
            <div class="tableBar">
                <!--                <el-input-->
                <!--                        v-model="input"-->
                <!--                        disabled="false"-->
                <!--                        placeholder="请输入客户端昵称"-->
                <!--                        style="width: 250px"-->
                <!--                        clearable-->
                <!--                        @clear="cleanQuery"-->
                <!--                        @keyup.enter.native="handleQuery"-->
                <!--                >-->
                <!--                    <i-->
                <!--                            slot="prefix"-->
                <!--                            class="el-input__icon el-icon-search"-->
                <!--                            style="cursor: pointer"-->
                <!--                            @click="init"-->
                <!--                    ></i>-->
                <!--                </el-input>-->
                <div class="tableLab">
                    <el-button
                            type="primary"
                            @click="addOauthtype('add')"
                    >
                        + 增加客户端
                    </el-button>
                </div>
            </div>
            <el-table
                    :data="tableData"
                    stripe
                    class="tableBox"
                    v-loading="usertableloading"
            >
                <el-table-column
                        prop="clientName"
                        sortable
                        label="客户端名称"
                        width="120"
                ></el-table-column>
                <el-table-column
                        prop="grantType"
                        label="授权类型"
                        sortable
                        width="120"
                >
                    <template slot-scope="{ row }">
                        <span v-if="String(row.grantType)==='1'">授权码模式</span>
                        <span v-else>其他</span>
                    </template>
                </el-table-column>

                <el-table-column
                        prop="redirectUri"
                        sortable
                        label="回调地址"
                        width="100"
                >
                </el-table-column>
                <el-table-column
                    prop="clientId"
                    sortable
                    label="客户端id"
                    width="160"
                >
                </el-table-column>
                <el-table-column
                    prop="clientSecret"
                    sortable
                    label="客户端秘钥"
                    width="160"

                >
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        sortable
                        label="创建时间"
                >
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        label="更新时间"
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
                            @click="editHandel(scope.row)"
                        >
                            编辑
                        </el-button>
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
                                    label="名称:"
                            >
                                <el-input
                                        v-model="classData.clientName"
                                        placeholder="请填写客户端名称"
                                />
                            </el-form-item>
                            <el-form-item label="授权类型：">
                                <el-select disabled v-model="classData.grantType" placeholder="请选择授权类型">
                                    <el-option
                                            v-for="item in grantTypeoptions"
                                            :key="item.label"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>


                            <el-form-item
                                label="回调地址:"
                            >
                                <!--  slot="label"  ==> 自定义label的插槽  -->
                                <template slot-scope="{}" slot="label">
                                    <HelpComponent>
                                        若不填写则需在请求时带上该参数,填写将回调填写的地址<br/>
                                        回调示例 http://10.15.245.1:8081/callback?code=xxxxxxxxx&state=传过来的state（若有）<br/>
                                        state:Client generated CSRF token. This value will be passed back to the client.
                                    </HelpComponent>
                                    <span>回调地址:</span>
                                </template>
                                <el-input
                                    style="width: 300px;"
                                    v-model="classData.redirectUri"
                                    placeholder="选填:例如http://www.baidu.com"
                                />
                            </el-form-item>


                            <el-form-item
                                label="客户端ID:"
                                v-if="this.action==='edit'"
                            >
                                <el-input
                                    v-model="classData.clientId"
                                    disabled
                                    style="width: 280px;"
                                    placeholder="请填写客户端ID"
                                />
                            </el-form-item>
                            <el-form-item
                                label="客户端秘钥:"
                            >
                                <el-input
                                    v-model="classData.clientSecret"
                                    :disabled="unEditUnSafeOption"
                                    style="width: 280px;"
                                    placeholder="请填写客户端秘钥"
                                />
                                <el-button
                                    v-if="unEditUnSafeOption"
                                    type="text"
                                    size="small"
                                    class="delBut non"
                                    @click="editClientSecret()"
                                >
                                    编辑
                                </el-button>
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
                >
                    <span v-if="this.action==='add'">添加</span>
                    <span v-else-if="this.action==='edit'">更新</span>
                </el-button>
          </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import router from "@/router";
import {addAuth, deleteAuth, editAuth, listAuth} from "@/api/auth";
import HelpComponent from "@/components/HelpComponent.vue";
export default {
    name: "MangerOauth",
    components: {HelpComponent},
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
            grantTypeoptions:[{label:"授权码模式",value:1}],
            classData: {
                id:'',//id
                title: '新建客户端',
                dialogVisible: false,
                redirectUri: '',
                grantType:1,//默认为授权码模式
                clientName:'',
                clientId:'',
                clientSecret:'',
            },
            inputStyle  : {'flex':1},
            unEditUnSafeOption:true,

        }
    },
    computed: {
        rules () {
            return {
                'clientName': [
                    {'required': true, 'message': '请选择客户端名称', 'trigger': ['change']}
                ],
                'redirectUri': [
                    {'required': false, 'message': '请输入回调地址[可选]', 'trigger': ['change']}
                ],
            }
        }
    },
    created() {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.token = localStorage.getItem('token')
        const userInfo = window.localStorage.getItem('userInfo')
        if (userInfo){
            if (String(this.userInfo.permission)==='10'){
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
        editClientSecret(){
            if (this.unEditUnSafeOption === false){
                return
            }
            this.$confirm('不建议手动编辑此项, 仍要编辑?', '警告？', {
                'confirmButtonText': '不听劝告',
                'cancelButtonText': '及时收手',
            }).then(async () => {
                this.unEditUnSafeOption = false
            })

        },
        editHandel(row){
            this.classData.id = row.id
            this.classData.clientName = row.clientName
            this.classData.redirectUri = row.redirectUri
            this.classData.grantType = row.grantType
            this.classData.title = '编辑客户端'
            this.classData.dialogVisible = true
            this.classData.clientId = row.clientId
            this.classData.clientSecret = row.clientSecret
            this.action = 'edit'

        },
        async init () {
            this.usertableloading = true
            // if (this.input){
            //     params.name = this.input ? this.input : undefined
            // }
            const res = await listAuth(this.page,this.pageSize)
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
        addOauthtype (st) {
            if (st === 'add'){
                this.action = 'add'
                this.cleanform()
                this.classData.title = '新增客户端'
                this.classData.dialogVisible = true
            }
        },
        // 删除
        deleteHandle (type, id) {
            this.$confirm('确认删除该客户端, 是否继续?', '确定删除', {
                'confirmButtonText': '确定',
                'cancelButtonText': '取消',
            }).then(async () => {
                const res = await deleteAuth(id)
                if (String(res.code)==='1'){
                    this.$message.success(res.data || '操作成功')
                    this.handleQuery()
                }else {
                    this.$message.error(res.msg || '操作失败')
                }
            })




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

            if (this.classData.redirectUri) {
                this.classData.redirectUri = ''
            }
            if (this.classData.clientName) {
                this.classData.clientName = ''
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
                        if (String(this.classData.clientName)==='') {
                            this.$message.error("请你输入完整")
                            return false;
                        }
                        data.redirectUri = this.classData.redirectUri
                        data.clientName = this.classData.clientName
                        data.grantType = this.classData.grantType

                        const res = await addAuth(data)
                        if (String(res.code)==='1'){
                            this.$message.success(res.data)

                            this.handleQuery()
                            this.cancel()
                            this.dialogVisible = false
                        }else {
                            this.$message.error(res.msg)
                        }
                        console.log(res)


                    }
                });
            }else if (this.action==='edit'){
                this.$refs["classData"].validate(async (valid) => {  //开启校验
                    console.log(valid)
                    if (!valid) {   // 如果校验通过，请求接口，允许提交表单
                        return false;
                    } else {
                        let data = {}
                        console.log(this.classData)
                        if (String(this.classData.clientName)==='') {
                            this.$message.error("请你输入完整")
                            return false;
                        }
                        data.id = this.classData.id
                        data.redirectUri = this.classData.redirectUri
                        data.clientName = this.classData.clientName
                        data.grantType = this.classData.grantType
                        data.clientSecret = this.classData.clientSecret

                        const res = await editAuth(data)
                        if (String(res.code)==='1'){
                            this.$message.success(res.data)

                            this.handleQuery()
                            this.cancel()
                            this.dialogVisible = false
                        }else {
                            this.$message.error(res.msg)
                        }
                        console.log(res)


                    }
                });
            }
        },
    }
}
</script>

<style scoped>
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
#Oauth-management .uploadImg .el-form-item__label::before{
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