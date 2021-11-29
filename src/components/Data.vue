<template>
  <div class="data_container">
    <table class="data_table">
      <tr class="th_tr">
        <th>id</th>
        <th>图片</th>
        <th class="title">商品标题</th>
        <th>商铺掌柜名</th>
        <th>商品类目</th>
        <th>月销量</th>
        <th>日销量</th>
        <th>2小时跑单</th>
        <th>在售价</th>
        <th>日预计可得</th>
        <th>月预计可得</th>
        <th></th>
      </tr>

      <tr v-for="item in list" :key="item.itemid">
        <td>
          {{item.itemid}}</td>
        <td><img :src="item.itempic" alt=""></td>
        <td class="titlename">{{item.itemtitle}}</td>
        <td>{{item.shopname}}</td>
        <td>{{type[item.fqcat-1]}}</td>
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
      <a-pagination v-model="current" :total="100" show-less-items @change="get" />
    </div>

  </div>
</template>

<script>
import bus from '@/components/eventbus.js'
export default {
  name:'Backstage',
  data(){
    return {
      type:['女装','男装','内衣','美妆','配饰','鞋品','箱包','儿童','母婴','居家','美食','数码','家电','其他','车品','文体','宠物'],
      list:[],
      current:1
    }
  },
  methods:{
    get(){
      bus.$emit('changepage',{
        page:this.current,
        pageSize:10,
        to:3
      })
      console.log(this.current);
    }
  },
  created(){
    this.get();
    bus.$on('toData',res=>{
      this.list =res;
    })
  },
  beforeRouteEnter (to, from, next){
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
.pagi{
  margin-top: 15px;
}
td img {
  width: 65px;
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
  width: 250px;
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