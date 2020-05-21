<template>
  <div class="home">
      <PageTitle  icon="fa fa-home" main="Dashboard" sub="Base De Conhecimento"/>
      <div class="stats">
        <Stat title="Categorias" :value="stat.categories" icon="fa fa-folder"  color="#d54d50"/>
        <Stat title="Artigos" :value="stat.articles" icon="fa fa-file"  color="#3bc480"/>
        <Stat title="Usuarios" :value="stat.users" icon="fa fa-user"  color="#3282cd"/>
      </div>
  </div>
</template>

<script>
import Stat from './Stat'
import axios from 'axios'
import {baseApiUrl} from '@/global'
import PageTitle from '../template/PageTitle'
export default {
name:'Home',
components:{PageTitle,Stat},
data:function() {
  return {
    stat:[]
  }
},
methods: {
  getStat(){
    axios.get(`${baseApiUrl}/stats`)
    .then((res) =>{
       this.stat = res.data
    })
  }
},
mounted() {
  this.getStat()
},
}
</script>

<style>
  .stats{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

</style>