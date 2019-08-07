'use strict'

const fp = require('fastify-plugin')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(function (fastify, opts, next) {
  /**
   * Create Book with Author Ids and Genere Ids
   * @param { Object } bookData Instance & metadata of Book
   * @param { Array } genereIds  array of genere Ids
   * @param { Array } authorIds  Array of Author Ids
   */
  fastify.decorate('createBook', async (bookData, genereIds, authorIds) => {
    const genereArr = []
    const authorArr = []
    const book_doc = await fastify.sql.models.Book.create({
      ...bookData
    })

    if (genereIds && genereIds.length) {
      genereIds.forEach(element => {
        genereArr.push({ genere_id: element, book_id: book_doc.id })
      })
    }
    if (authorIds && authorIds.length) {
      authorIds.forEach(elem => {
        authorArr.push({
          author_id: elem,
          book_id: book_doc.id
        })
      })
    }
    if (genereArr && genereArr.length) {
      await fastify.sql.models.bookGenere.bulkCreate(genereArr)
    }

    if (authorArr && authorArr.length) {
      await fastify.sql.models.bookAuthor.bulkCreate(authorArr)
    }
    return book_doc
  })

  /**
   * Create Generes
   * @param { String } name
   * @param { String } description
   *
   */
  fastify.decorate('createGenere', (name, description) => {
    return fastify.sql.models.Genere.create({ name: name, description: description })
  })

  /**
   * Create Author
   * @param { String } name
   * @param { String } description
   *
   */
  fastify.decorate('createAuthor', (name, age) => {
    return fastify.sql.models.Author.create({ full_name: name, age: age })
  })

  /**
   * List of Authors
   *  @param { String } id
   *  if no id passed it will fetch all
   */

  // TODO: implement pagination incase fetching all
  fastify.decorate('listAuthors', (id) => {
    if (id) {
      return fastify.sql.models.Author.findOne({ id: id })
    } else {
      return fastify.sql.models.Author.findAll({})
    }
  })

  /**
   * List of Geners
   *  @param { String } id
   *  if no id passed it will fetch all
   */

  // TODO: implement pagination incase fetching all
  fastify.decorate('listGeneres', (id) => {
    if (id) {
      return fastify.sql.models.Genere.findOne({ id: id })
    } else {
      return fastify.sql.models.Genere.findAll({})
    }
  })

  /**
   * List of Books
   *  @param { String } id
   *  if no id passed it will fetch all without details
   */

  // TODO: implement pagination incase fetching all

  fastify.decorate('listBooks', (id) => {
    if (id) {
      return fastify.sql.models.Book.findOne({ where: { id: id }, include: [{ model: fastify.sql.models.bookAuthor, include: [fastify.sql.models.Author] }, { model: fastify.sql.models.bookGenere, include: [fastify.sql.models.Genere] }] })
    } else {
      return fastify.sql.models.Book.findAll({})
    }
  })

  /**
   * Ad Author to Book
   *  @param { Array } authorIds
   *  @param { String } bookId
   *
   */
  fastify.decorate('addAuthorToBook', (authorIds, bookId) => {
    const rowD = []
    if (authorIds && authorIds.length) {
      authorIds.forEach(e => {
        rowD.push({ author_id: e, book_id: bookId })
      })
    }
    return fastify.sql.models.bookAuthor.bulkCreate(rowD)
  })

  /**
   * Ad Author to Book
   *  @param { Array } genereIds
   *  @param { String } bookId
   *
   */
  fastify.decorate('addGenereToBook', (genereIds, bookId) => {
    const rowD = []
    if (genereIds && genereIds.length) {
      genereIds.forEach(e => {
        rowD.push({ genere_id: e, book_id: bookId })
      })
    }
    return fastify.sql.models.bookGenere.bulkCreate(rowD)
  })

  /**
   *  Removes Genere from Books record
   *  @param { String } genere_id
   *  @param { String } book_id
   */
  fastify.decorate('removeGenereFromBook',(genere_id,book_id)=>{
    return fastify.sql.models.bookGenere.destroy({where:{genere_id:genere_id,book_id:book_id}})
  })

  /**
   *  Removes Author from Books record
   *  @param { String } author_id
   *  @param { String } book_id
   */
  fastify.decorate('removeAuthorFromBook',(author_id,book_id)=>{
    return fastify.sql.models.bookAuthor.destroy({where:{author_id:author_id,book_id:book_id}})
  })

  /**
   *  Edits Book Record
   *  @param { Object } updated_data
   *  @param { String } book_id
   */
  fastify.decorate('editBook',(updated_data,book_id)=>{
    return fastify.sql.models.Book.update({...updated_data},{where:{id:book_id}});
  });

  next()
})
