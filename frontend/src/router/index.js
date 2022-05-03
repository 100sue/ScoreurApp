import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Wall from'../views/Wall.vue'
import Profil from '../views/Profil.vue'
import Community from '../views/Community.vue'
import ModifyPost from '../views/ModifyPost.vue'



const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/wall',
    name: 'Wall',
    component: Wall
  },
  {
    path: '/profil',
    name: 'Profil',
    component: Profil
  },
 
]


const router = new createRouter({
  history: createWebHistory(),
  routes
})


export default router