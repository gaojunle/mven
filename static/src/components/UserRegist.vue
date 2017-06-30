<template>
  <el-form :model="registForm" :rules="rules" ref="registForm" label-position="left" label-width="0px"
           class="registForm">
    <h3 class="title">用户注册</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="registForm.username" auto-complete="off" placeholder="请输入注册账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="registForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item prop="repassword">
      <el-input type="password" v-model="registForm.repassword" auto-complete="off" placeholder="请再次输入密码"></el-input>
    </el-form-item>
    <el-form-item prop="mobile">
      <el-input type="text" v-model="registForm.mobile" auto-complete="off" placeholder="请输入手机号"></el-input>
    </el-form-item>
    <el-form-item prop="capcode">
      <el-col :span="12">
        <el-input type="text" v-model="registForm.capcode" auto-complete="off" placeholder="请输入验证码"></el-input>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="11">
        <img @click="changecapcodeSrc" class="img-capcode"
             :src="capcodeSrc" alt="">
      </el-col>
    </el-form-item>
    <el-form-item prop="smscode">
      <el-col :span="12">
        <el-input type="text" v-model="registForm.smscode" auto-complete="off" placeholder="请输入短信验证码"></el-input>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="11">
        <el-button type="info" :disabled="isSmsCode" @click="getSmsCode">获取短信验证码</el-button>
      </el-col>
    </el-form-item>
    <el-form-item class="errormsg" v-show="this.errormsg!=''">
      <div class="el-form-item__error">{{errormsg}}</div>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.prevent="handleRegist" :loading="logining">用户注册
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-row type="flex" class="row-bg" justify="space-between">
        <router-link to="userLogin">用户登录</router-link>
        <router-link to="forgetpwd" class="">忘记密码</router-link>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'hello',
    mounted() {

    },
    data () {
      var validateRePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validateMobile = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else if (!/^1[3|4|5|7|8][0-9]{9}$/.test(value)) {
          callback(new Error('手机号码格式不正确!'));
        } else {
          callback();
        }
      };
      return {
        registForm: {
          username: 'admin',
          password: '123456',
          repassword: '123456',
          mobile: '13716732040',
          capcode: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'change'},
            {min: 4, message: '最少6个字符', trigger: 'change'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'change'},
            {min: 6, message: '最少6位密码', trigger: 'change'}
          ],
          repassword: [
            {validator: validateRePass, trigger: 'change'}
          ],
          mobile: [{validator: validateMobile, trigger: 'change'}],
          capcode: [{required: true, message: '请输入图片验证码', trigger: 'change'}],
          smscode: [{required: true, message: '请输入短信验证码', trigger: 'change'}]
        },
        errormsg: '',
        logining: false,
        capcodeSrc: 'http://localhost:3000/captpng?width=160&height=36'
      }
    },
    computed: {
      isSmsCode: function () {
        let mobile = this.registForm.mobile;
        let capcode = this.registForm.capcode;
        return !(/^1[3|4|5|7|8][0-9]{9}$/.test(mobile) && capcode != '');
      }
    },
    methods: {
      getSmsCode(){
        this.$http.post('/api/user/regsmscode', {mobile: this.registForm.mobile}).then((response) => {
          if (response.body.errno == 0) {
            alert(response.body.errmsg)
          } else {
            alert(response.body.errmsg)
          }
        });
      },
      handleRegist(){
        var that = this;
        this.$refs.registForm.validate(valid => {
          if (valid) {
            this.$http.post('/api/user/regist', this.registForm).then((response) => {
                var data = response.body;
                if (data.errno != 0) {
                  that.errormsg = data.errmsg;
                } else {
                  alert('注册成功');
                  this.$router.push('userLogin')
                }
              }, (err) => {
                console.error(err);
              }
            )
          }
        })
      },
      changecapcodeSrc: function () {
        this.capcodeSrc = 'http://localhost:3000/captpng?width=160&height=36&_t=' + new Date().getTime()
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .registForm {
    .title {
      font-size: 20px;
    }
    box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .img-capcode {
      width: 100%;
      height: 36px;
      vertical-align: top;
      cursor: pointer;
    }
  }
</style>
