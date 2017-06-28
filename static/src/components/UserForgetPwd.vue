<template>
  <el-form :model="ruleForm" :rules="rules2" ref="ruleForm" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin" :loading="logining">用户登录
      </el-button>
    </el-form-item>
    <el-form-item>
      <router-link to="forgetpwd">忘记密码</router-link>
    </el-form-item>
    <el-form-item>
      <el-button type="default" style="width:100%;" @click.native.prevent="sendSms">用户注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  //import {requestLogin} from '../api/api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          checkPass: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        checked: true
      };
    },
    methods: {
      forgetPwd() {
        var _this = this;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.logining = true;
            var loginParams = {username: this.ruleForm.account, password: this.ruleForm.checkPass};

            this.$http.get('/api/user', {params: loginParams}).then((response) => {
              console.log(response);
              this.logining = false;
            }, (err) => {
              this.logining = true;
              console.error(err);
            })
          } else {
            console.log('error submit!!');
            this.logining = true;
            return false;
          }
        });
      },

      //登录事件
      handleLogin(ev) {
        var _this = this;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.logining = true;
            var loginParams = {username: this.ruleForm.account, password: this.ruleForm.checkPass};
            this.$http.post('/api/user/login', loginParams).then((response) => {
              console.log(response.body);
              this.logining = false;
            }, (err) => {
              this.logining = false;
              console.error(err);
            })
          } else {
            console.log('error submit!!');
            this.logining = true;
            return false;
          }
        });
      },

      //发送短信
      sendSms(){
        this.$http.post('/api/smscode', {mobile: '13716732040'}).then((response) => {
          console.log('send success');
        }, (err) => {
          console.error(err);
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
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
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
