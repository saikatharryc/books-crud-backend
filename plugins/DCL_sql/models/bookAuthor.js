module.exports = (sequelize, Sequelize) => {
  const bookAuthor = sequelize.define('bookAuthor', {
  }, {
    tableName: 'bookAuthor',
    freezeTableName: true
  })

  bookAuthor.associate = (models) => {
    bookAuthor.belongsTo(models.Author, {
      foreignKey: 'author_id',
      hooks: true
    })
    bookAuthor.belongsTo(models.Book, {
      foreignKey: 'book_id',
      hooks: true
    })
  }

  return bookAuthor
}
