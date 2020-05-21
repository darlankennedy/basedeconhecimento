const queries = require('./queries')
module.exports = app =>{
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req,res)=>{
        const article = { ...req.body }
        if(req.params.id){
            article.id = req.params.id
        }

        
        try {
            existsOrError(article.name , "Nome Não Informado")
            existsOrError(article.description, 'Descrição não informado')
            existsOrError(article.categoryId,'Categoria nãp informada')
            existsOrError(article.userId,'Autor não informado')
            existsOrError(article.content,'Conteúdo não informado')
            
        } catch (error) {
            res.status(400).send(error)
        }


        if(article.id){
            app.db('articles')
            .update(article)
            .where({id:article.id})
            .then((result) => {
                res.status(204).send()
            }).catch((err) => {
                res.status(500).send(err)
            });
        }else{
            app.db('articles')
            .insert(article)
            .then((result) => {
                res.status(204).send()
            }).catch((err) => {
                res.status(500).send(err)
            });
        }
    }//fim save

    const remove = async (req,res) =>{
        
        try {
            const rowDeleted = 
            await app.db('articles')
                    .where({id:req.params.id}).del()

                    try {
                        existsOrError(rowDeleted, 'Artigo não foi encontrado')              
                    } catch (error) {
                       return res.status(400).send(error) 
                    }
           
            res.status(204).send()
        } catch (error) {
            res.status(500).send(error)
        }
    }

    const limit = 10///usando para consulta paginada


    const get = async (req,res) =>{
        const page = req.query.page || 1
        console.log('teste')
        const result = await app.db('articles').count('id').first()

        const count = parseInt(result.count)

        app.db('articles')
            .select('id','name','description')
            .limit(limit).offset(page * limit - limit)
            .then(articles => res.json({data:articles,count,limit}))
            .catch(err => res.status(500).send(err))
    }


    const getById =  (req,res) =>{
       
        app.db('articles')
            .where({id:req.params.id})
            .first()
            .then(article =>{
                article.content = article.content.toString()
                return res.json(article)
            })
            .catch(err => res.status(500).send(err))
    }

    const getByCategory = async  (req,res) =>{
        const categoryId = req.params.id
        const page = req.query.page || 1
        const categories =  await app.db.raw(queries.categoruWithChildren,categoryId)
        const ids = categories.rows.map(c => c.id)
         
        app.db({a: 'articles',u:'users'})
            .select('a.id','a.name','a.description','a.imageUrl',{author:'u.name'})
            .limit(limit).offset(page * limit - limit)
            .whereRaw('?? = ??',['u.id','a.userId'])
            .whereIn('categoryId',ids)
            .orderBy('a.id','desc')
            .then(articles =>{
                console.log(articles)
                return res.json(articles)
            })
            .catch(err => res.status(500).send(err))
    }




    return {save, remove,get,getById,getByCategory}
}