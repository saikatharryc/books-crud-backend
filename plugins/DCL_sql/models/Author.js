module.exports = (sequelize, Sequelize) => {
  const Author = sequelize.define(
    "Author",
    {
      full_name: {
        type: Sequelize.STRING(50),
        notEmpty: true,
        allowNull: false,
        comment: "Name of the Author"
      },
      age: {
        type: Sequelize.INTEGER(3),
        notEmpty: true,
        allowNull: false,
        comment: "Age of the Author"
      }
    },
    {
      tableName: "author"
    }
  );

  Author.associate = models => {
    Author.hasMany(models.bookAuthor, {
      foreignKey: "author_id",
      onDelete: "CASCADE",
      hooks: true
    });
  };

  return Author;
};
