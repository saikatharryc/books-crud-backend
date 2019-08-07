module.exports = (sequelize, Sequelize) => {
  const Genere = sequelize.define(
    "Genere",
    {
      name: {
        type: Sequelize.STRING(50),
        notEmpty: true,
        allowNull: false,
        comment: "Title of the genere"
      },
      description: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: "Description of the genere"
      }
    },
    {
      tableName: "genere"
    }
  );

  Genere.associate = models => {
    Genere.hasMany(models.bookGenere, {
      foreignKey: "genere_id",
      onDelete: "CASCADE",
      hooks: true
    });
  };

  return Genere;
};
