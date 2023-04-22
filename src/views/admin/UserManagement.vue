<template>
<div class="sdss" id="user-management">
  <div class="container">
    <div class="tableBar">
      <el-input
          v-model="input"
          placeholder="请输入用户昵称"
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
        <span class="span-btn blueBug non" @click="statusHandle('1')">批量解封</span>
        <span style="border:none;" class="span-btn delBut non" @click="statusHandle('0')">批量封禁</span>
        <el-button
            type="primary"
            @click="addUsertype('add')"
        >
          + 增加用户
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
          width="25"
      ></el-table-column>
      <el-table-column
          prop="name"
          label="用户名称"
          width="90"
      ></el-table-column>
      <el-table-column
          prop="sex"
          label="用户性别"
          width="90"
      ></el-table-column>
      <el-table-column prop="avatar" label="用户头像" align="center">
        <template slot-scope="{ row }">
          <el-image style="width: auto; height: 40px; border:none;cursor: pointer;"
                  :src="row.avatar"
                  :preview-src-list="[ `${row.avatar}` ]" >
              <div slot="error" class="image-slot">
<!--                  <i class="el-icon-picture-outline"></i>-->
                  <img src="@/assets/notimage.png">
              </div>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column label="用户状态" width="100">
        <template slot-scope="scope">
          <span :style="String(scope.row.status) === '0'? 'color: red;margin-right: 10px;': 'color: #0c56dc;margin-right: 10px;'">{{ scope.row.status == '0' ? '封禁' : '正常' }}</span>
        </template>
      </el-table-column>


        <el-table-column
                prop="permissionName"
                label="用户权限"
                width="60"
        >
        </el-table-column>
      <el-table-column
          prop="createTime"
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
              class="blueBug"
              :disabled="scope.row.id==1"
              @click="addUsertype(scope.row)"
          >
            修改
          </el-button>
          <el-button
              type="text"
              size="small"
              class="blueBug"
              :disabled="scope.row.id==1"
              @click="statusHandle(scope.row)"
          >
            {{ String(scope.row.status) === '0' ? '解封' : '封禁' }}
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
          width="80%"
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
                label="用户名称:"
                prop="name"
            >
              <el-input
                  v-model="classData.name"
                  placeholder="请填写用户昵称"
                  maxlength="20"
              />
            </el-form-item>
            <el-form-item
                label="用户名:"
                prop="username"
            >
              <el-input
                  v-model="classData.username"
                  placeholder="请填写用户名"
                  maxlength="26"
              />
            </el-form-item>
            <el-form-item
                label="用户密码:"
                prop="password"
            >
              <el-input
                  :disabled="this.action==='edit'"
                  v-model="classData.password"
                  type="password"
                  :placeholder="this.action==='edit'?'密码不可编辑':'请填写用户密码'"
                  maxlength="32"
              />
            </el-form-item>
            <el-form-item
                label="手机号:"
                prop="phone"
            >
              <el-input
                  v-model="classData.phone"
                  placeholder="请填写用户手机号"
                  maxlength="11"
              />
            </el-form-item>
            <el-form-item
                label="学号:"
                prop="studentId"
            >
              <el-input
                  v-model="classData.studentId"
                  placeholder="请填写用户学号"
                  maxlength="12"
              />
            </el-form-item>
            <el-form-item label="用户性别：" prop="sex">
              <el-select v-model="classData.sex" placeholder="请选择用户性别">
                <el-option
                    v-for="item in sexoptions"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户状态：">
              <el-select v-model="classData.status" placeholder="请选择">
                <el-option
                    v-for="item in statusoptions"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户权限：" prop="permission">
              <el-select v-model="classData.permission" placeholder="请选择用户性别">
                <el-option
                    v-for="item in permissionoptions"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>


          <div>
          </div>
          <el-form-item
              label="头像:"
              prop="image"
              class="uploadImg"
          >
            <!--必须加header，不然后端会拦截-->
              <MyElUploadImage :avatar.sync="classData.avatar"></MyElUploadImage>
          </el-form-item>

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
                >确 定</el-button>
                <el-button
                    v-if="action != 'edit'"
                    type="primary"
                    size="medium"
                    class="continue"
                    @click="submitForm('go')"
                > 保存并继续添加 </el-button>
          </span>
      </el-dialog>
    </div>
  </div>
</div>
</template>

<script>
import router from "@/router";
import * as Api from "@/api/login";
import MyElUploadImage from "@/components/MyElUploadImage.vue";
export default {
  name: "UserManagement",
    components: {MyElUploadImage},
  data() {
    return {

      input: '',
      counts: 0,
      page: 1,
      pageSize: 5,
      tableData : [],
      userState : '',
      checkList: [],
      usertableloading:false,
      userInfo: {},
      token:'',
      isAdmin:false,
      sexoptions:[{label:"男",value:"男"},{label:"女",value:"女"}],
      classData: {
        id:'',//id
        title: '新建用户',
        dialogVisible: false,
        studentId: '',
        sex:'男',
        name: '',//用户名
        username:'',
        phone:'',
        password:'',
        status:'1',//默认启用
        avatar:'',//url
        permission:'2',//默认为用户
      },
      statusoptions:[{
        label:"启用",
        value:"1"
      },
        {
          label:"封禁",
          value:"0"
        }],
      action:'',
      imageUrl: '',
      dishList: [],
      inputStyle  : {'flex':1},
        permissionoptions:[{"label":'管理员','value':'1'},{"label":'用户','value':'2'}],//用户权限
    }
  },
  computed: {
    rules () {
      return {
        'name': [
          {'required': true, 'message': '请填写用户名称', 'trigger': ['blur','change']}
        ],
        'username': [
          {'required': true, 'message': '请输入用户名', 'trigger': ['blur','change']}
        ],
        'password': [
          {
            'required': true,
            // 'message': '请填写用户密码',
            validator: (rules, value, callback) => {
              if (!value) {
                this.$message.error("请填写用户密码")
                callback(new Error('请填写用户密码'))

              }
              callback()
            },
            'trigger': ['blur']
          },
        ],
        'phone': [
          {
            'required': true,
            // 'message': '请填写用户密码',
            validator: (rules, value, callback) => {
              if (!value) {
                this.$message.error("请填写用户手机号")
                callback(new Error('请填写用户手机号'))
              } else {
                if (!/^1[34578]\d{9}$/.test(value)){
                  this.$message.error("格式错误")
                  callback(new Error('格式错误'))
                }
                callback()

              }
            },
            'trigger': ['blur']
          },
        ],
        'studentId': [
          {
            'required': true,
            // 'message': '请填写用户密码',
            validator: (rules, value, callback) => {
              if (!value) {
                this.$message.error("请填写用户学号")
                callback(new Error('请填写用户学号'))
              }else {
                if (!/^[2-2][0-0][2-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/.test(value)){
                  this.$message.error("格式错误")
                  callback(new Error('格式错误'))
                }
                callback()
              }
            },
            'trigger': ['blur']
          },
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
      if (this.input){
        params.name = this.input ? this.input : undefined
      }
      const res = await Api.getUserList(params)
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
    addUsertype (st) {
      if (st === 'add'){
        this.action = 'add'
        this.cleanform()
        this.classData.title = '新增用户'
        this.classData.dialogVisible = true
      } else {
        this.action = 'edit';
        this.classData.title = '编辑用户';
        this.classData.id = String(st.id);
        this.classData.name = String(st.name);
        this.classData.username = String(st.username);
        this.classData.status = String(st.status);
        this.classData.avatar = String(st.avatar);
        this.classData.studentId = String(st.studentId);
        this.classData.phone = String(st.phone);
        this.classData.image = String(st.image);
        this.classData.sex = String(st.sex);
        this.imageUrl = String(st.image);
        this.classData.permission = String(st.permission);
        this.classData.dialogVisible = true;

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
      params.id = String(type === '批量' ? this.checkList.join(',') : id)
      this.$confirm('确认删除该用户, 是否继续?', '确定删除', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
      }).then(async () => {
        const res = await Api.delUserList(params)
        if (String(res.code)==='1'){
          this.$message.success(res.msg)
          this.handleQuery()
        }else {
          this.$message.error(res.msg || '操作失败')
        }
      })
    },
    //状态更改
    statusHandle (row) {
      let data = {}
      if (typeof row === 'string' ) {
        if (this.checkList.length === 0) {
          this.$message.error('批量操作，请先勾选操作用户！')
          return false
        }
        data.id = this.checkList.join(',')
        data.status = row
      } else {
        data.id = row.id
        data.status = String(row.status)==='1' ? '0' : '1'
      }
      this.userState = data
      this.$confirm('确认更改该用户状态?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(async () => {
        const res = await Api.updatauserstatus(data)
        if (String(res.code)==='1'){
          this.$message.success(res.msg)
          this.handleQuery()
        }else {
          this.$message.error('请求出错了：' + res.msg)
        }
      })
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
      if (this.classData.name) {
        this.classData.name = ''
      }
      if (this.classData.sex) {
        this.classData.sex = '男'
      }
      if (this.classData.avatar) {
        this.classData.avatar = ''
      }
      if (this.classData.password) {
        this.classData.password = ''
      }
      if (this.classData.permission) {
        this.classData.permission = '2'
      }
      if (this.classData.phone) {
        this.classData.phone = ''
      }
      if (this.classData.status) {
        this.classData.status = '1'//默认启用
      }
      if (this.classData.username) {
        this.classData.username = ''
      }
      if (this.classData.studentId) {
        this.classData.studentId = ''
      }
    },

    cancel(){
      this.cleanform()
      this.classData.dialogVisible = false
    },

    async submitForm(st) {
      if ((st === 'go')&&this.action==='add') {
        //继续添加
        //添加

        this.$refs["classData"].validate(async (valid) => {  //开启校验
          if (valid) {   // 如果校验通过，请求接口，允许提交表单
            let data = {}
            if (!this.classData.name) {
              this.$message.error("请你输入完整")
              return false;
            }
            if (!this.classData.sex) {
              this.$message.error("请你输入完整")
              return false;
            }
            if (!this.classData.password) {
              this.$message.error("请你输入完整")
              return false;
            }
            if (!this.classData.permission) {
              this.$message.error("请你输入完整")
              return false;
            }
            if (!this.classData.phone) {
              this.$message.error("请你输入完整")
              return false;
            }
            if (!this.classData.status) {
              this.$message.error("请你输入完整")
              return false;
            }
            if (!this.classData.username) {
              this.$message.error("请你输入完整")
              return false;
            }
            if (!this.classData.studentId) {
              this.$message.error("请你输入学号")
              return false;
            }
            data.name = this.classData.name
            data.sex = this.classData.sex
            data.avatar = this.classData.avatar
            data.password = this.classData.password
            data.permission = this.classData.permission
            data.phone = this.classData.phone
            data.status = this.classData.status
            data.username = this.classData.username
            data.studentId = this.classData.studentId
            const res = await Api.addUser(data)
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
        if (this.action==='add'){
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
              if (!this.classData.sex) {
                this.$message.error("请你输入完整")
                return false;
              }
              if (!this.classData.password) {
                this.$message.error("请你输入完整")
                return false;
              }
              if (!this.classData.permission) {
                this.$message.error("请你输入完整")
                return false;
              }
              if (!this.classData.phone) {
                this.$message.error("请你输入完整")
                return false;
              }
              if (!this.classData.status) {
                this.$message.error("请你输入完整")
                return false;
              }
              if (!this.classData.username) {
                this.$message.error("请你输入完整")
                return false;
              }
              if (!this.classData.studentId) {
                this.$message.error("请你输入学号")
                return false;
              }
              data.name = this.classData.name
              data.sex = this.classData.sex
              data.avatar = this.classData.avatar
              data.password = this.classData.password
              data.permission = this.classData.permission
              data.phone = this.classData.phone
              data.status = this.classData.status
              data.username = this.classData.username
              data.studentId = this.classData.studentId
              const res = await Api.addUser(data)
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
          });
        }else if (this.action==='edit'){
          let data = {}
          if (!this.classData.name) {
            this.$message.error("请你输入完整")
            return false;
          }
          if (!this.classData.sex) {
            this.$message.error("请你输入完整")
            return false;
          }
          if (!this.classData.permission) {
            this.$message.error("请你输入完整")
            return false;
          }
          if (!this.classData.phone) {
            this.$message.error("请你输入完整")
            return false;
          }
          if (!this.classData.status) {
            this.$message.error("请你输入完整")
            return false;
          }
          if (!this.classData.username) {
            this.$message.error("请你输入完整")
            return false;
          }
          if (!this.classData.studentId) {
            this.$message.error("请你输入学号")
            return false;
          }
          data.id = this.classData.id
          data.name = this.classData.name
          data.sex = this.classData.sex
          data.avatar = this.classData.avatar
          data.permission = this.classData.permission
          data.phone = this.classData.phone
          data.status = this.classData.status
          data.username = this.classData.username
          data.studentId = this.classData.studentId
          const res = await Api.updataforuser(data)
          if (String(res.code)==='1'){
            this.$message.success(res.msg)
            this.cancel()
            this.handleQuery()
            this.dialogVisible = false
          }else {
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
#user-management .uploadImg .el-form-item__label::before{
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