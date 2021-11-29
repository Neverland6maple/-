<template>
  <div class="app_container">
    <!-- 整体页面布局 -->
    <a-layout id="components-layout-demo-fixed-sider" style="min-height: 100vh">
      <!-- 侧边栏 -->
      <a-layout-sider @collapse="col" v-model="collapsed" collapsible width="300px" :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }" :theme="theme">
        <!-- 简单换肤 -->
        <div class="change_theme">
          <a-switch checked-children="亮" un-checked-children="按" :default-checked="defaultChecked" class="switch" @change="change_theme" />
        </div>
        <!-- 侧边栏主板块 -->
        <a-menu theme="light" :default-selected-keys="['1']" mode="inline">
          <!-- 首页：轮播图 -->
          <a-menu-item key="1">
            <router-link to="/">
              <a-icon type="shopping-cart" />
              <span>首页
              </span>
            </router-link>
          </a-menu-item>
          <!-- 逛一逛：商品浏览 -->
          <a-sub-menu key="sub1">

            <span slot="title">
              <a-icon type="unordered-list" />
              <span>
                <router-link to="/shop">逛一逛</router-link>
              </span>
            </span>

            <template v-for="(item,index) in type">
              <a-sub-menu :key="index+2">
                <span slot="title">
                  <span>
                    <router-link :to='"/shop?id="+index'>{{item}}</router-link>
                  </span>
                </span>

                <a-menu-item :key='"sort1"+item'>
                  <router-link :to='"/shop?id="+index+"&sort=1"'>好单指数</router-link>
                </a-menu-item>
                <a-menu-item :key='"sort2"+item'>
                  <router-link :to='"/shop?id="+index+"&sort=2"'>今日销量</router-link>
                </a-menu-item>
                <a-menu-item :key='"sort3"+item'>
                  <router-link :to='"/shop?id="+index+"&sort=3"'>两小时销量</router-link>
                </a-menu-item>
              </a-sub-menu>
            </template>
          </a-sub-menu>
          <!-- 看一看：商品原视频浏览 -->
          <a-menu-item key="20">
            <router-link to="/douyin">
              <a-icon type="video-camera" />
              <span>看一看</span>
            </router-link>
          </a-menu-item>
          <!-- 后台：数据图表以及后台数据表（需权限） -->
          <a-menu-item key="21">
            <router-link to="/backstage">
              <a-icon type="file" />
              <span>后台</span>
            </router-link>
          </a-menu-item>
        </a-menu>

        <a-menu-divider>
        </a-menu-divider>
        <a-menu-divider>
        </a-menu-divider>

      </a-layout-sider>
      <!-- 右侧视图 -->
      <a-layout ref="main" refs="bg" :style="main" :class="sty">
        <!-- 头部 -->
        <a-layout-header ref="hd" :style="{background:'#e6f7ff',padding: 0,position:'relative'}" :class="sty">
          <div class="drawer">
            <!-- 打开购物车按钮 -->
            <a-button type="primary" @click="showDrawer" class="drawer_btn">
              <a-icon type="shopping-cart" />购物车
            </a-button>
            <!-- <a-drawer :title="slot" placement="right" :closable="false" :visible="visible" :after-visible-change="afterVisibleChange" @close="onClose" class="drawer_bd">
              <ul>

                <li class="cart" v-for="item in cart" :key="item.itemid">
                  <div class="prod_cart">
                    <div class="prod_pic">
                      <img :src="item.src" alt="">
                    </div>
                    <div class="prod_title">

                      <h3 @click="send(item.all)">{{item.title}}</h3>

                    </div>
                    <div class="prod_data">
                      <span class="num">
                        数量:
                        <span class="sub_prod" :data-pid="item.itemid" @click="update_num(-1,$event)" v-if="update">
                          -
                        </span>
                        <i @dblclick="update_dir">
                          {{item.num}}
                        </i>
                        <input type="text" class="item_num" @input="num_only" v-model.lazy="item.num" @blur="hide_inp" style="display:none">

                        <span @click="update_num(1,$event)" :data-pid="item.itemid" class="add_prod" v-if="update">+</span>
                      </span>
                      <span class="total_count">总计：￥<i>{{(parseFloat(item.unit_price) + parseInt(item.num-1)*parseFloat(item.ori_price)).toFixed(2)}}</i></span>

                    </div>
                    <span class="remove" :data-pid="item.itemid" @click="remove">移除该商品</span>
                  </div>
                </li>

              </ul>
              <div class="barrier"></div>
              <div class="im_buy">
                <a-button type="primary" size="large" class="buy_btn">
                  立刻购买
                </a-button>
                <span class="total">总计:￥<i>{{total_price.toFixed(2)}}</i></span>
              </div>

            </a-drawer> -->
            <!-- 购物车抽屉-->
            <Drawer></Drawer>

          </div>
        </a-layout-header>

        <a-layout-content style="margin: 0 16px">
          <a-breadcrumb style="margin: 16px 0 ">
          </a-breadcrumb>
          <!-- 主视区 -->
          <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }" class="bd">
            <router-view></router-view>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import bus from '@/components/eventbus.js'
import request from '@/utils/request.js'
import Drawer from '@/components/Drawer.vue'
export default {
  data() {
    return {
      list:[],
      cat:0,
      page:1,
      pageSize:5,
      order:1,
      //layout布局
      collapsed: false,
      //样式
      main:{margin:'0 0 0 300px',transition:'all 0.15s ease-out',transform:''},
      theme:localStorage.getItem('theme') || 'light',
      sty: localStorage.getItem('sty') || '',
      // visible: false,
      // slot:<span><a-icon type="shopping-cart" style="marginRight:8px;fontSize:18px"/>您的购物车</span>,
      // cart:JSON.parse(localStorage.getItem('cart')) || [],
      // update:true,
      type:['全部','女装','男装','内衣','美妆','配饰','鞋品','箱包','儿童','母婴','居家','美食','数码','家电','其他','车品','文体','宠物']
    };
  },
  created(){
    this.req(2);
    bus.$on('changepage',obj=>{
      this.page = obj.page;
      this.pageSize = obj.pageSize
      this.req(obj.to)
    });
    bus.$on('changecat',obj=>{
      this.cat = obj.cat
      this.page = obj.page
      this.pageSize= obj.pageSize
      this.order = obj.order || this.order;
      this.req()
    });
    bus.$on('random_5',val=>{
      this.page = val.page;
      this.pageSize = val.pageSize
      this.cat = val.type
      this.req(val.to);
    });
    // bus.$on('addcart',()=>{
    //   this.cart = JSON.parse(localStorage.getItem('cart'));
    // })
  },
  computed: {
    defaultChecked(){
      if(localStorage.getItem('theme') === 'dark'){
        return false
      }else{
        return true
      }
    },
    // total_price(){
    //   let top = 0;
    //   this.cart.forEach(item => {
    //     top += parseFloat(item.unit_price) + parseInt(item.num-1)*parseFloat(item.ori_price);
    //   });
    //   return top;
    // }
  },
   methods:{
    async req(flag){
        const { data:{data:res} } = await request.get('/',{
        params:{
          apikey:'JBu2ajrAhjPbGOd42FgiCpUxT25o75ZK',
          back:this.pageSize,
          min_id:this.page || 1,
          cat_id:this.cat,
          order:this.order
          }
        })
        
      this.list = res;

      if(!flag){
        bus.$emit('share',this.list)
      }else if(flag == 1){
        bus.$emit('toRandom',this.list)
      }else if(flag == 2){
        bus.$emit('toCaro',this.list)
      }else if(flag == 3){
        bus.$emit('toData',this.list)
      }else if(flag == 4){
        bus.$emit('toDy',this.list)
      }
    },
    col(collapsed, type){
      if(collapsed){
        this.main.transform = 'translateX(-100px)'
      }else{
        this.main.transform = ''
      }
    },
    change_theme(checked){
      if(checked){
        this.theme = 'light';
        this.sty = '';
        localStorage.setItem('theme','light');
        localStorage.setItem('sty','');
      }else {
        this.theme = 'dark;'
        this.sty = 'main';
        localStorage.setItem('theme','dark');
        localStorage.setItem('sty','main');
      }
    },
    showDrawer() {
      // this.visible = true;
      bus.$emit('showdrawer',true)
    },
    // onClose() {
    //   this.visible = false;
    // },
    // remove(e){
    //   const id =e.target.dataset.pid;
    //   let index ;
    //   this.cart.some((cur,ind)=>{
    //     if(cur.itemid == id){
    //       index = ind;
    //       return true;
    //     }
    //   })
    //   if(index !== undefined){
    //     this.cart.splice(index,1);
    //   }
    // },
    // update_num(val,e){
    //   const id =e.target.dataset.pid;
    //   this.cart.some(cur=>{
    //     if(cur.itemid == id){
    //       if(val == -1 && cur.num <= 1 ){
    //         return true
    //       } 
    //       cur.num = parseInt(cur.num) + parseInt(val)
    //       return true;
    //     }
    //   })
    // },
    // update_dir(e){
    //   this.update = !this.update 
    //   this.$nextTick(()=>{
    //     e.path[1].querySelector('.item_num').style.display = '';
    //   e.path[1].querySelector('.item_num').focus()
    //   })
    // },
    // hide_inp(e){
    //   this.update = !this.update
    //   e.target.style.display = "none";
    // },
    // num_only(e){
    //   e.target.value = e.target.value.replace(/[^\d]/g,'')
    //   if(isNaN(parseInt(e.target.value-0)) || parseInt(e.target.value) <= 0 || e.target.value == ''){
    //     e.target.value = 1
    //     // console.log('nan');
    //   }
    // },
    // send(val){
    //   this.$router.push('/details');
    //   bus.$emit('todetails',{
    //     prod:val
    //   })
    // }
  // },
  // watch:{
  //   cart:{
  //     handler(e){
  //       localStorage.setItem('cart',JSON.stringify(this.cart))
  //     },
  //     deep:true
  //   }
  // },
  // directives:{
  //   focus:{
  //     inserted(el){
  //       el.focus();
  //     }
  //   }
  },
  components:{
    Drawer
  }
}
</script>

<style scoped>
/* .total{
  position: absolute;
  left: 115px;
  font-size: 12px;
  line-height: 20px;
  bottom: 10px;
}
.total i {
  color: #FF0036;
  font-size: 20px;
  line-height: 12px;

}
.buy_btn{
  margin-left: 15px;
}
.num span{
  cursor: pointer;
  display: none;
  padding: 0 2px;
}
.num:hover span{
  display: inline-block;
  background-color: #f1f1f1;
  color: #000;
}
.num span:hover{
box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.2);
}
.num .sub_prod{
  position: absolute;
  padding: 0 3px;
  left: 30px;
}
.add_prod{
  position: absolute;
  left: 70px;
}
i{
  font-style: normal;
}
*{
  margin: 0;
  padding: 0;
}
li{
  list-style: none;
}
.prod_title{
  padding: 0 10px;
  
}
.prod_title h3 {
  color: #777;
  font-size: 13px;
  line-height: 16px;
  cursor: pointer;
}
.prod_title h3:hover{
  text-decoration: underline;
  
}
.prod_pic{
  text-align: center;
}
.prod_pic img{
  width: 170px;
}
.num{
  position: absolute;
  left: 5px;
  bottom: -20px;
  
}
.num i{
  position: absolute;
  display: inline-block;
  width: 40px;
  text-align: center;
  left: 34px;
}
.item_num {
  position: absolute;
  width: 24px;
  text-align: center;
  left: 44px;
  height: 16px;
  outline: none;
  /* border: none; */
/*}
.prod_data{
  font-size: 12px;
  line-height: 16px;
}
.total_count{
  position: absolute;
  left: 90px;
  bottom: -20px;
}
.total_count i {
  font-size: 16px;
  line-height: 12px;
  color: #FF0036;
}
.prod_data{
  position: relative;
}
.prod_cart{
  margin-bottom: 28px;
  position: relative;
  height: 230px;
  width: 208px;
  /* background-color: powderblue; */
/*  border-bottom: 1px dotted #999;
}
.remove{
  position: absolute;
  right: -5px;
  top:-21px;
  color: #1890ff;
  font-size: 12px;
}
.remove:hover{
  text-decoration: underline;
}
.barrier{
  height: 60px;
} */
.im_buy{
  position: absolute;
  background-color: #fff;
  width: 240px;
  height: 60px;
  line-height: 60px;
  bottom: 0;
  right: 17px;
}
.drawer_btn{
  position: absolute;
  right: 40px;
  top: 20px;
}

 .main{
  background-color: #032341 !important;
}
.change_theme{
  position: relative;
  height: 35px;
}
.switch{
  position: absolute;
  right: 10px;
  top: 8px;
}
#components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>