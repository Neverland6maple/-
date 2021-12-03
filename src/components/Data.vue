<template>
  <div class="data_container">
    <table class="data_table">
      <!-- th -->
      <tr class="th_tr">
        <th>id</th>
        <th>图片</th>
        <th class="title">商品标题</th>
        <th class="shopname">商铺掌柜名</th>
        <th>
          <a-dropdown>
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              类目({{type[category]}})
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-for="(item,index) in type" :key="index">
                <a href="javascript:;" @click="change_cat(index)">{{item}}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </th>
        <th>月销量</th>
        <th class="order_btn" @click="change_ord(2)">
          <a-icon type="eye" v-if="order == 2" />
          日销量
        </th>
        <th class="order_btn" @click="change_ord(3)">
          <a-icon type="eye" v-if="order == 3" />
          2小时跑单
        </th>
        <th>在售价</th>
        <th>日预计可得</th>
        <th>月预计可得</th>
        <th></th>
      </tr>
      <!-- td -->
      <tr v-for="item in list" :key="item.itemid">
        <td>{{item.itemid}}</td>
        <!-- 小图片采取小像素，增加网页加载速度 -->
        <td><img :src="item.itempic"></td>
        <td class="titlename">{{item.itemtitle}}</td>
        <td>{{item.shopname || item.seller_name}}</td>
        <td>{{type[item.fqcat]}}</td>
        <td>{{item.itemsale}}</td>
        <td>{{item.todaysale}}</td>
        <td>{{item.itemsale2}}</td>
        <td>￥{{item.itemprice}}</td>
        <td>
          ￥{{(item.tkmoney * item.todaysale).toFixed(2)}}</td>
        <td>
          ￥{{(item.tkmoney * item.itemsale).toFixed(2)}}</td>
        <td class="dir">
          <router-link :to="{name:'details',params:item}">页面</router-link>
        </td>
      </tr>
    </table>
    <div class="pagi">
      <a-pagination v-model="current" :total="count" show-less-items @change="get" />
    </div>
  </div>
</template>

<script>
export default {
  name:'Backstage',
  data(){
    return {
      type:['全部','女装','男装','内衣','美妆','配饰','鞋品','箱包','儿童','母婴','居家','美食','数码','家电','其他','车品','文体','宠物'],
      list:[],
      //当前页
      current:1,
      //排序
      order:1,
      //分类
      category:0,
      //分页数据总数
      count:100
    }
  },
  created(){
    this.get();
    this.$bus.$on('toData',res=>{
      this.list =res;
    })
    this.$bus.$on('toData2',res=>{
      this.count = res.length;
    })
  },
   methods:{
    get(){
      this.$bus.$emit('changepage',{
        page:this.current,
        pageSize:10,
        cat:this.category,
        order:this.order,
        to:3
      })
    },
    change_cat(c){
      this.category = c;
      this.current = 1;
      this.get();
       //请求计算数据个数
      this.$bus.$emit('totalnum',{
        pageSize:100,
        cat:this.category,
        order:this.order,
        to:5
      })
    },
    change_ord(o){
    this.order = o;
     this.get();
    }
  }, 
  //组件内导航 判断进入当前组件时是否有权限 不能访问this
  beforeRouteEnter (to, from, next){
    if(from.path == "/login"){
      next()
      return true;
    }
    const cookie = document.cookie.split(';');
    let c = '';
    if(cookie == '' || cookie == null){
      next('/login');
      return false
    }
    cookie.some(item =>{
      c = item.trim();
      if(c.indexOf('token' == 0)){
        c = c.substring(6);
        c = JSON.parse(c)
        return true;
      }
    })
    if(c!=''){
      next();
    }else{
      next('/login')
    }
  },
}
</script>

<style scoped>
.order_btn{
  cursor: pointer;
  transition: all 0.05s; 
}
.order_btn:hover{
  transform: scale(1.04);
}
th a{
  color: #fff;
}
.shopname{
  width: 160px;
}
.pagi{
  margin-top: 15px;
}
td img {
  width: 55px;
}
tr th:last-child{
  border-right: 0px;
}
.titlename{
  text-align: left;
  padding-left: 15px;
}
.dir{
  padding: 0 8px;
}
td a{
  text-align: center;
}
.title{
  text-align: left;
  padding-left: 20px;
  width: 230px;
}
.data_table{
  position: relative;
  width: 1140px;
}
th {
  padding-left: 12px;
}
td{
  text-align: center;
}
table .th_tr{
  height: 35px;
  background-color: #62abee;
  border-top: 10px solid #62abee;
  border-bottom: 10px solid #62abee;
  color: #fff;
  
}
tr th {
  font-weight: 500;
}
th{
  border-right: 1px solid #fff;
}
tr{
  height: 100px;
}
td{
  line-height: 24px;
}
tr:nth-child(even){
  background-color: #f1f1f1;
}
</style>