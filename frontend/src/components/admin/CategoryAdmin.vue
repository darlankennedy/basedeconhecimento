<template>
  <div class="category-admin">
    <b-form>
        <input id="category-id" v-model="category.id" type="hidden">
      <b-row>
        <b-col md="12" sm="12">
            <b-form-group label="Nome:" label-for="category-name">
                      <b-form-input :readonly="mode === 'remove'" id="category-name" type="text" v-model="category.name"  required placeholder="Informe o Nome do Da categoria"/>
            </b-form-group>

            <b-form-group id="input-group-3" label="Categoria Pai:" label-for="category-parentId">
              <b-form-select  v-if="mode === 'save'" id="category-parentId" v-model="category.parentId"  :options="categories" required />
                <b-form-input v-else id="category-parentId" type="text" v-model="category.path" />
            </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col >
          <b-button variant="primary" class="mr-2" v-if="mode === 'save'" @click="save">Salvar</b-button>
          <b-button variant="danger" class="mr-2"  v-if="mode === 'remove'" @click="remover">Excluir</b-button>
           <b-button @click="reset" >Cancelar</b-button>
        </b-col>
      </b-row>
    </b-form>

    <hr>
    <b-table hover striped responsive="sm" :items="categories" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadCategory(data.item)">
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button variant="danger" class="ml-2" @click="loadCategory(data.item,'remove')">
          <i class="fa fa-trash"></i>
        </b-button>
      </template>

    </b-table  > 
  </div>
</template>

<script>

import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name:"CategoryAdmin",

    data: function() {
      return {
        mode:'save',
        category:{},
        sortBy: 'id',
        sortDesc: true,
        categories: [],
        fields: [

                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'path', label: 'Caminho', sortable: true },
                { key: 'actions', label: 'Ações',sortable: false}
            
            ]
      }
    },
    methods: {  

      loadCategories(){
        const url = `${baseApiUrl}/categories`       
        axios.get(url)
        .then((response) => {
        //  this.categories = response.data
        this.categories = response.data.map(category => {
          // console.log({...category, value:category.id,text:category.path})
          return {...category, value:category.id,text:category.path}
        })
        }).catch(showError)

      },
      reset(){
        this.category = {}
        this.mode = 'save'
        this.loadCategories()
      },
      save(){
        const method = this.category.id ? 'put' : 'post';
        const id = this.category.id ? `/${this.category.id}` : '';
        // console.log(this.category,method,id)
        axios[method](`${baseApiUrl}/categories${id}`,this.category).then(res =>{
          console.log(res.data)
          this.$toasted.global.defaultSuccess()
          this.reset()
        }).catch(err => {
        showError(err)  
        })
      },
      loadCategory(category,mode ='save'){
        
        this.mode = mode
        this.category = {...category}
        
        
      },
      remover(){
        const id = this.category.id
        axios.delete(`${baseApiUrl}/categories/${id}`,id).then(res => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                }).catch(err => {
                   showError(err) 
                })
      }
      
    },

    mounted() {
      this.loadCategories()
    },

}
</script>

<style>

</style>