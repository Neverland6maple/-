<template>
  <div class="app_container">
    <!-- 整体页面布局 -->
    <a-layout id="components-layout-demo-fixed-sider" style="min-height: 100vh" :class="sty">
      <!-- 侧边栏 -->
      <a-layout-sider @collapse="col" v-model="collapsed" collapsible width="300px" :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }" :theme="theme">
        <div class="sta_name">
          <img src="@/assets/dy.png" alt="">
          <p style="color:black" v-if="theme == 'light'">抖音电商</p>
          <p style="color:white" v-else>抖音电商</p>
        </div>
        <!-- 简单换肤 -->
        <div class="change_theme">
          <a-switch checked-children="亮" un-checked-children="暗" :default-checked="theme == 'light'" class="switch" @change="change_theme" />
        </div>
        <!-- 侧边栏主板块 -->
        <a-menu :default-selected-keys="def" mode="inline" :theme="theme">
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
                <!-- 图标 -->
                <span slot="title">
                  <span>
                    <router-link :to='"/shop?id="+index'>{{item}}</router-link>
                  </span>
                </span>
                <!-- 子分组：排序 -->
                <!-- id为商品分类sort为排列顺序 -->
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
        <a-menu-divider></a-menu-divider>
        <a-menu-divider></a-menu-divider>
      </a-layout-sider>
      <!-- 右侧视图 -->
      <a-layout ref="main" :style="main" :class="sty" id="main">
        <!-- 头部 -->
        <a-layout-header ref="hd" :style="{background:'#e6f7ff',padding: 0,position:'relative'}" :class="sty">
          <div class="drawer">
            <!-- 打开购物车按钮 -->
            <a-button type="primary" @click="showDrawer" class="drawer_btn">
              <a-icon type="shopping-cart" />购物车
            </a-button>
            <!-- 购物车抽屉-->
            <Drawer></Drawer>
          </div>
        </a-layout-header>

        <a-layout-content style="margin: 0 16px">
          <a-breadcrumb style="margin: 16px 0 ">
          </a-breadcrumb>
          <!-- 主视区 -->
          <div :style="{ padding: '24px', background: '#fff', minHeight: '360px',minWidth:'1180px',width:'1180px'}" class="bd">
            <router-view></router-view>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import request from '@/utils/request.js'
import Drawer from '@/components/Drawer.vue'
export default {
  data() {
    return {
      list:[],
      //商品分类序号，默认为0，即全部
      cat:0,
      //请求的数据页
      page:1,
      //一次请求的数据数
      pageSize:5,
      //排序方式
      order:1,
      //layout布局
      collapsed: false,
      //样式
      main:{margin:'0 0 0 300px',transition:'all 0.15s ease-out',transform:'',position:'relative',width:'1180px'},
      //皮肤样式
      theme:localStorage.getItem('theme') || 'light',
      sty:localStorage.getItem('sty') || '',
      //分类数值
      type:['全部','女装','男装','内衣','美妆','配饰','鞋品','箱包','儿童','母婴','居家','美食','数码','家电','其他','车品','文体','宠物'],
      //侧边栏默认选中
      def:['sort1全部']
    };
  },
  created(){
    this.req(2);
    this.$bus.$on('random_5',val=>{
      this.page = val.page;
      this.pageSize = val.pageSize
      this.cat = val.type
      this.req(val.to);
    });
    this.$bus.$on('changepage',obj=>{
      this.page = obj.page;
      this.pageSize = obj.pageSize
      this.cat = isNaN(obj.cat) ? this.cat : obj.cat;
      this.order = obj.order || this.order ;
      this.req(obj.to)
    });
    this.$bus.$on('totalnum',obj=>{
      this.page = 1;
      this.pageSize = obj.pageSize;
      this.cat = obj.cat;
      this.order = obj.order;
      this.req(obj.to)
    })
  },
   methods:{
    async req(flag){
        const { data:{data:res} } = await request.get('/',{
        params:{
          back:this.pageSize,
          min_id:this.page || 1,
          cat_id:this.cat,
          order:this.order
          }
        })
      this.list = res;
      if(!flag){
        //默认将数据发送至shop组件
        this.$bus.$emit('share',this.list)
      }else if(flag == 1){
        //详情页为您推荐
        this.$bus.$emit('toRandom',this.list)
      }else if(flag == 2){
        //轮播图
        this.$bus.$emit('toCaro',this.list)
      }else if(flag == 3){
        //数据列表
        this.$bus.$emit('toData',this.list)
      }else if(flag == 4){
        //视频
        this.$bus.$emit('toDy',this.list)
      }else if(flag == 5){
        //data组件分页总数
        this.$bus.$emit('toData2',this.list)
      }else if(flag == 6){
        //shop组件分页总数
        this.$bus.$emit('share2',this.list)
      }
    },
    //板块跟着侧边栏收缩而移动
    col(collapsed, type){
      if(collapsed){
        this.main.margin = '0 0 0 200px'
      }else{
        this.main.margin = '0 0 0 300px'
      }
    },
    //换肤相关
    change_theme(checked){
      if(checked){
        this.theme = 'light';
        this.sty = '';
        localStorage.setItem('theme','light');
        localStorage.setItem('sty','');
      }else {
        this.theme = 'dark'
        this.sty = 'main';
        localStorage.setItem('theme','dark');
        localStorage.setItem('sty','main');
      }
    },
    //弹出购物车
    showDrawer() {
      this.$bus.$emit('showdrawer',true)
    },
  },
  components:{
    Drawer
  },
  watch:{
    //用于同步刷新页面时的侧边栏默认选择情况
    '$route':{
      handler(to,from){
      if(from == undefined){
        const path = to.path.substr(1);
        switch(path){
          case 'shop':
            const sort = to.query.sort;
            const id = to.query.id
            if(sort && id){
              this.def = [`sort${sort}${this.type[id]}`];
            }else {
              this.def = ['sort1全部'];
            }
            break;
          case 'details':
            this.def = ['sub1'];
            break;
          case 'douyin':
            this.def = ['20']
            break;
          case 'backstage':
          case 'login':
          case 'data':
            this.def = ['21']
            break;
          default:
            this.def = ['1'];
        }
      }
      },
      immediate:true
    }
  }
}
</script>

<style scoped>
.sta_name{
  position: absolute;
  height: 30px;
  top: 8px;
  left: 85px;
  line-height: 30px;
  overflow: hidden;
}
.sta_name img {
  float: left;
  width: 26px;
  height: 26px;
}
.sta_name p {
  float: left;
  margin-left: 3px;
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
}
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