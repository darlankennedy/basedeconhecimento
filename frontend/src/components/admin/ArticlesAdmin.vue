<template>
  <div class="article-admin">
    <b-form>
        <input id="article-id" v-model="article.id" type="hidden">
      <b-row>
        <b-col md="12" sm="12">
            <b-form-group label="Nome:" label-for="article-name">
                      <b-form-input :readonly="mode === 'remove'" id="article-name" type="text" v-model="article.name"  required placeholder="Informe o Nome do Artigo..."/>
            </b-form-group>
             <b-form-group label="Descrição:" label-for="article-description">
                      <b-form-input :readonly="mode === 'remove'" id="article-description" type="text" v-model="article.description"  required placeholder="Informe o Nome do Artigo..."/>
            </b-form-group>
              <b-form-group label="Imagem (URL):" label-for="article-imageUrl">
                      <b-form-input :readonly="mode === 'remove'" id="article-imageUrl" type="text" v-model="article.imageUrl"  required placeholder="Informe Url Da Imagem"/>
            </b-form-group>


            <b-form-group v-if="mode === 'save'"  label="Categoria:" label-for="article-categoryId">
              <b-form-select   id="article-categoryId" v-model="article.categoryId"  :options="categories" required />
            </b-form-group>

            <b-form-group v-if="mode === 'save'"  label="Autor:" label-for="article-userId">
              <b-form-select   id="article-userId" v-model="article.userId"  :options="users" required />
            </b-form-group>
            <b-form-group  label="Conteúdo:" label-for="article-content">
              <VueEditor v-model="article.content" placeholder="Informe o conteudo do Artigo..." />
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
    <b-table hover striped responsive="sm" :items="articles" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadArticle(data.item)">
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button variant="danger" class="ml-2" @click="loadArticle(data.item,'remove')">
          <i class="fa fa-trash"></i>
        </b-button>
      </template>

    </b-table  >

    <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
  </div>
</template>

<script>
import {VueEditor} from 'vue2-editor'
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
   name:"ArticleAdmin",
   components:{VueEditor},
    data: function() {
      return {
        mode:'save',
        article:{},
        articles: [],
        categories:[],
        users:[],
        page:1,
        limit:0,
        count:0,
        sortBy: 'id',
        sortDesc: true,
        fields: [

                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'description', label: 'Descrição', sortable: true },
                { key: 'actions', label: 'Ações',sortable: false}
            
            ]
      }
    },
    methods: {  

      loadArticles(){
        const url = `${baseApiUrl}/articles?page=${this.page}`       
    
        axios.get(url)
        .then((res) => {
          this.articles = res.data.data
          this.count = res.data.count
          this.limit = res.data.limit
          }).catch(err =>{
            console.log(err)
            showError(err)})

      },
      reset(){
        this.article = {}
        this.mode = 'save'
        this.loadArticles()
      },
      save(){
        const method = this.article.id ? 'put' : 'post';
        const id = this.article.id ? `/${this.article.id}` : '';
        // console.log(this.article,method,id)
        axios[method](`${baseApiUrl}/articles${id}`,this.article).then(res =>{
          this.$toasted.global.defaultSuccess()
          this.reset()
        }).catch(err => {
        showError(err)  
        })
      },
      loadArticle(article,mode ='save'){
        
        this.mode = mode

        axios.get(`${baseApiUrl}/articles/${article.id}`)
          .then(res => this.article = res.data)
          .catch(err =>{
            showError(err)
          })
        
      },
      loadCategories(){
        const url = `${baseApiUrl}/categories`

        axios.get(url).then(res => {
          this.categories = res.data.map(category =>{
            return {value:category.id,text : category.path}
          })
        }).catch(err => {
          showError(err)
        })

      },

      loadUsers(){
        const url = `${baseApiUrl}/users`

        axios.get(url).then(res => {
          this.users = res.data.map(user =>{
            return {value:user.id,text : `${user.name} - ${user.email}`}
          })
        }).catch(err => {
         
          showError(err)
        })
      },

      remover(){
        const id = this.article.id
        axios.delete(`${baseApiUrl}/articles/${id}`,id).then(res => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                }).catch(err => {
                   showError(err) 
                })
      }
      
    },
    watch: {
      page(){
        this.loadArticles()
      }
    },

    mounted() {
      this.loadUsers()
      this.loadCategories()
      this.loadArticles()
    },

}
</script>

<style>

</style>