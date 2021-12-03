<template>
  <div class="login_container">
    <div class="login">
      <div class="title">
        <h2>请输入管理员账号</h2>
      </div>
      <div class="username">
        <div class="lab">
          <label for="username">用户名：</label>
        </div>
        <div class="ipt">
          <input type="text" id="username" v-model="username">
        </div>
      </div>
      <div class="password">
        <div class="lab">
          <label for="password">密码：</label>
        </div>
        <div class="ipt">
          <input type="text" id="password" v-model="password">
        </div>
      </div>
      <div class="login_btn" @click="login">
        <a-button size="large">登录</a-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      username:'',
      password:''
    }
  },
  methods:{
    login(){
      if(this.username.trim() !='' && this.password.trim() != ''){
        document.cookie = "token=" + JSON.stringify({
        username:this.username,
        password:this.password
      });
      }else{
        alert('请输入正确的用户名和密码');
      }
    const cookie = document.cookie.split(';');

    if(cookie!=''){
        let c = '';
        cookie.some(item =>{
        c = item.trim();
        if(c.indexOf('token' == 0)){
          c = c.substring(6);
          c = JSON.parse(c) 
          return true;
        }
      })
        if(c!=''){
          //需进一步验证用户名和密码....
          this.$router.push('/data');
        }else{
          alert('请输入正确的用户名和密码')
        }
    }else{
      //本地文件形式访问不到cookie
      this.$router.push('/data');
    }

    }
  }
}
</script>
<style>
.title {
  text-align: center;
  ;
}
.title h2 {
  color: #1890ff;
  letter-spacing: 1px;
  line-height: 24px;
  margin-bottom: 4px;
}
.login_container{
  display: flex;
  height: 560px;
  justify-content:center;
  align-items:center;
}
.login{
  position: relative;
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 220px;
  background-color: #f6f6f6;
  padding: 20px 10px;
}
.lab {
  float: left;
  text-align: right;
  width: 80px;
  font-size: 18px;
  color: #888;
}
.ipt {
  float: left;
}
.ipt input {
  width: 280px;
  height: 36px;
  line-height: 36px;
}
.username,.password{
  height: 60px;
  line-height: 60px;
}
input {
  outline: none;
  border: 1px solid #ccc;
}
.login_btn {
  position:absolute;
  right: 44px;
  bottom: 16px;
}
</style>