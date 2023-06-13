<template>
  <div id="nav-management" class="sdss">
    <div class="container">
      <div class="tableBar">
        <el-input
            v-model="input"
            clearable
            placeholder="请输入导航分类昵称"
            style="width: 250px"
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
              @click="addUsertype('add')"
          >
            + 增加导航分类
          </el-button>
        </div>
      </div>
      <el-table
          v-loading="navtableloading"
          :data="tableData"
          class="tableBox"
          stripe
          @selection-change="handleSelectionChange"
      >
        <el-table-column
            type="selection"
            width="25"
        ></el-table-column>
        <el-table-column
            label="导航分类名称"
            prop="name"
            width="1000"
        ></el-table-column>
        <el-table-column
            align="center"
            label="操作"
            width="200"
        >
          <template slot-scope="scope">
            <el-button
                class="blueBug"
                size="small"
                type="text"
                @click="addUsertype(scope.row)"
            >
              修改
            </el-button>

            <el-button
                class="delBut non"
                size="small"
                type="text"
                @click="deleteHandle('单删', scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20, 40]"
          :total="counts"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
      </el-pagination>
      <div>
        <el-dialog
            :append-to-body="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            :title="classData.title"
            :visible.sync="classData.dialogVisible"
            style="z-index: 2100"
            width="80%"
        >
          <el-form
              ref="classData"
              :inline="true"
              :model="classData"
              :rules="rules"
              class="demo-classData"
              label-width="180px"
          >
            <div>
              <el-form-item
                  label="用户名称:"
                  prop="name"
              >
                <el-input
                    v-model="classData.name"
                    maxlength="20"
                    placeholder="请填写用户昵称"
                />
              </el-form-item>
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
                    size="medium"
                    type="primary"
                    @click="submitForm()"
                >确 定</el-button>
                <el-button
                    v-if="action != 'edit'"
                    class="continue"
                    size="medium"
                    type="primary"
                    @click="submitForm('go')"
                > 保存并继续添加 </el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import * as Api from "@/api/login";

export default {
  name: "navfenlei",
  data() {
    return {
      headerObj: {
        Authorization: localStorage.getItem('token'),
        navId: localStorage.getItem('navId')
      },
      input: '',
      counts: 0,
      page: 1,
      pageSize: 5,
      tableData: [],
      navState: '',
      checkList: [],
      navtableloading: false,
      navInfo: {},
      token: '',
      isAdmin: false,
      sexoptions: [{label: "男", value: "男"}, {label: "女", value: "女"}],
      classData: {
        id: '',//id
        title: '新建导航分类',
        dialogVisible: false,
        name: '',//导航分类名

      },
      inputStyle: {'flex': 1},
    }
  },
  computed: {
    rules() {
      return {
        'name': [
          {'required': true, 'message': '请填写导航分类名称', 'trigger': ['blur', 'change']}
        ]
      }
    }
  },
  created() {
    this.navInfo = JSON.parse(localStorage.getItem('navInfo'))
    this.token = localStorage.getItem('token')
    this.init()
  },
  mounted() {
  },
  methods: {

    async init() {
      this.navtableloading = true
      let params = {}
      params.pageNum = this.page
      params.pageSize = this.pageSize
      if (this.input) {
        params.name = this.input ? this.input : undefined
      }
      const res = await Api.getNavListForFenlei(params)
      console.log(res)
      if (String(res.code) === '1') {
        this.tableData = res.data.records || []
        this.counts = Number(res.data.total)
      } else {
        this.$message.error('请求出错了：' + res.msg)
      }
      this.navtableloading = false

    },
    handleQuery() {
      this.page = 1;
      this.init();
    },
    cleanQuery() {
      this.page = 1;
      this.input = undefined
      this.init()
    },
    // 添加
    addUsertype(st) {
      if (st === 'add') {
        this.action = 'add'
        this.cleanform()
        this.classData.title = '新增导航分类'
        this.classData.dialogVisible = true
      } else {
        this.action = 'edit'
        this.classData.title = '编辑导航分类'
        this.classData.id = String(st.id)
        this.classData.name = String(st.name)

        this.classData.dialogVisible = true

      }
    },
    // 删除
    deleteHandle(type, id) {
      let params = {}
      if (type === '批量' && id === null) {
        if (this.checkList.length === 0) {
          return this.$message.error('请选择删除对象')
        }
      }
      params.id = String(type === '批量' ? this.checkList.join(',') : id)
      this.$confirm('确认删除该导航分类, 是否继续?', '确定删除', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
      }).then(async () => {
        const res = await Api.deleteNavigationCategorize(params)
        if (String(res.code) === '1') {
          this.$message.success(res.msg)
          this.handleQuery()
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      })
    },
    // 全部操作
    handleSelectionChange(val) {
      let checkArr = []
      val.forEach((n) => {
        checkArr.push(n.id)
      })
      this.checkList = checkArr
    },
    handleSizeChange(val) {
      console.log(val)
      this.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      if (val > (Number(this.counts) / Number(this.pageSize)) + 1) {
        this.$message.info("最大页了")
        return
      }
      this.page = val
      this.init()
    },
    cleanform() {
      if (this.classData.name) {
        this.classData.name = ''
      }
    },
    outSelect(st, index) {
      const _this = this
      setTimeout(() => {
        const obj = JSON.parse(JSON.stringify(_this.dishFlavors[index]))
        obj.showOption = st
        _this.dishFlavors.splice(index, 1, obj)
      }, 200)
    },
    // inputHandle(val,index){
    //   // this.selectFlavor(false,index)
    //   // console.log(val,index)
    // },
    cancel() {
      this.cleanform()
      this.classData.dialogVisible = false
    },
    selectHandle(val, key, ind) {
      const arrDate = [...this.dishFlavors]
      arrDate[key] = JSON.parse(JSON.stringify(this.dishFlavorsData[ind]))
      this.dishFlavors = arrDate
    },
    async submitForm(st) {
      if ((st === 'go') && this.action === 'add') {
        //继续添加
        //添加

        this.$refs["classData"].validate(async (valid) => {  //开启校验
          if (valid) {   // 如果校验通过，请求接口，允许提交表单
            let data = {}
            if (!this.classData.name) {
              this.$message.error("请你输入完整")
              return false;
            }

            data.name = this.classData.name
            const res = await Api.createCategorize(data)
            if (String(res.code) === '1') {
              this.$message.success(res.msg)
              this.cleanform()
              this.handleQuery()

            } else {
              this.$message.error(res.msg)
            }
            console.log(res)
          } else {   //校验不通过
            return false;
          }
        });
      } else {
        //添加
        if (this.action === 'add') {
          this.$refs["classData"].validate(async (valid) => {  //开启校验
            console.log(valid)
            if (!valid) {   // 如果校验通过，请求接口，允许提交表单
              console.log("edit")
              return false;
            } else {
              let data = {}
              if (!this.classData.name) {
                this.$message.error("请你输入完整")
                return false;
              }

              data.name = this.classData.name

              const res = await Api.createCategorize(data)
              if (String(res.code) === '1') {
                this.$message.success(res.msg)

                this.handleQuery()
                this.cancel()
                this.dialogVisible = false
              } else {
                this.$message.error(res.msg)
              }
              console.log(res)
            }
          });
        } else if (this.action === 'edit') {
          let data = {}
          if (!this.classData.name) {
            this.$message.error("请你输入完整")
            return false;
          }
          data.id = this.classData.id
          data.name = this.classData.name
          const res = await Api.updataforquicknavigationcategorize(data)
          if (String(res.code) === '1') {
            this.$message.success(res.msg)
            this.cancel()
            this.handleQuery()
            this.dialogVisible = false
          } else {
            this.$message.error(res.msg)
          }

        }
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

#nav-management .uploadImg .el-form-item__label::before {
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
  width: 100%;
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