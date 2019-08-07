module.exports= (sequelize, Sequelize) => {
	const bookGenere = sequelize.define('bookGenere', {
	}, {
        tableName: 'bookGenere',
        freezeTableName: true
	});

	bookGenere.associate = (models) => {
        bookGenere.belongsTo(models.Genere, {
			foreignKey: 'genere_id',
			hooks: true
		        });
        bookGenere.belongsTo(models.Book, {
			foreignKey: 'book_id',
			hooks: true
        });
	}

	return bookGenere;
}
