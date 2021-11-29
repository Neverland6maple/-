import Vue from 'vue'
import VueRouter from 'vue-router'
//商品浏览页
import Shop from '@/components/Shop.vue'
//商品详情页
import Details from '@/components/Details.vue'
//相关视频
import Remv from '@/components/Remv.vue'
//轮播图
import Carousel from '@/components/Carousel.vue'
//饼图
import Chart from '@/components/Chart.vue'
//后台数据
import Data from '@/components//Data.vue'
//视频播放块
import Douyin from '@/components/Douyin.vue'
//登录页面
import Login from '@/components/Login.vue'
Vue.use(VueRouter)

const routes = [
  {path:'/shop',component:Shop},
  { name:'details',
    path:'/details',
    component:Details,
    children:[
    {name:'remv',path:'remv',component:Remv}
  ]},
  {path:'/',component:Carousel},
  {path:'/backstage',component:Chart},
  {path:'/data',component:Data},
  {path:'/douyin',component:Douyin},
  {path:'/login',component:Login}
]

const router = new VueRouter({
  routes
})


const VueRouterPush =  VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router
