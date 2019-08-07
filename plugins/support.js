'use strict'

const fp = require('fastify-plugin')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(function (fastify, opts, next) {
 
  /*
   * Create Book with Author Ids and Genere Ids
   * @param { Object } bookData Instance & metadata of Book
   * @param { Array } genereIds  array of genere Ids
   * @param { Array } authorIds  Array of Author Ids
   */
  fastify.decorate('createBooks', async (bookData,genereIds,authorIds)=> {
    const genereArr = []
    const authorArr =[]
    const book_doc= await fastify.sql.models.Book.create({
      ...bookData
    });
    
    if(genereIds && genereIds.length){
      genereIds.forEach(element => {
        genereArr.push({genere_id:element,book_id:book_doc.id})
      });
    }
    if(authorIds && authorIds.length){
      authorIds.forEach(elem=>{
        authorArr.push({
          author_id:elem,
          book_id:book_doc.id
        });
      })
    }
    if(genereArr && genereArr.length){
     await fastify.sql.models.bookGenere.bulkCreate(genereArr);
    }
  
    if(authorArr && authorArr.length){
      await fastify.sql.models.bookAuthor.bulkCreate(authorArr);
    }
    return book_doc;
  });

  /*
   * Create Generes 
   * @param { String } name
   * @param { String } description 
   * 
   */
  fastify.decorate('createGenere', ( name, description)=>{
    return fastify.sql.models.Genere.create({name,description});
  })

  /*
   * Create Author 
   * @param { String } name
   * @param { String } description 
   * 
   */
  fastify.decorate('createAuthor', ( name, age)=>{
    return fastify.sql.models.Author.create({name,age});
  })



  next()
})


