module.exports=(sequelize, Sequelize) => {
	const bookAuthor = sequelize.define('bookAuthor', {
	}, {
        tableName: 'bookAuthor',
        freezeTableName: true
	});

	bookAuthor.associate = (models) => {
        bookAuthor.belongsTo(models.Author, {
			foreignKey: 'author_id',
        });
        bookAuthor.belongsTo(models.Book, {
			foreignKey: 'book_id',
        });
	}

	return bookAuthor;
}
