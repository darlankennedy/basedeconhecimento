<template>
  <div class="admin-pages">
      <PageTitle  icon="fa fa-cogs" main="Adminstração do Sistema" sub="Cadastros & Cia"/>
      <div class="admin-pages-tabs">
        <b-card no-body>
          <b-tabs card>
            <b-tab title="Artigos">
              <ArticleAdmin/>
            </b-tab>
            <b-tab title="Categorias">
              <CategoryAdmin/>
            </b-tab>
            <b-tab title="Usuario">
              <UserAdmin/>
            </b-tab>

          </b-tabs>
        </b-card>
      </div>
  </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import ArticleAdmin from '../admin/ArticlesAdmin'
import CategoryAdmin from '../admin/CategoryAdmin'
import UserAdmin from '../admin/UserAdmin'

export default {
name:'AdminPages',
components:{PageTitle,ArticleAdmin,CategoryAdmin,UserAdmin}
}
</script>

<style>

</style>