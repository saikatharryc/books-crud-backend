module.exports=(sequelize, Sequelize) => {
	const Book = sequelize.define('Book', {
        title: {
            type: Sequelize.STRING(50),
            notEmpty: true,
			allowNull: false,
            comment: "Title of the Book"
        },
        summary: { type: Sequelize.STRING(500),
			allowNull: true,
            comment: "Description of the album"
        },
	}, {
		tableName: 'book'
	});

	Book.associate = (models) => {
		Book.hasMany(models.bookGenere, {
			foreignKey: 'book_id',
        });
        Book.hasMany(models.bookAuthor, {
			foreignKey: 'book_id',
        });
	}

	return Book;
}
