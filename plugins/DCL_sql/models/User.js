module.exports=(sequelize, Sequelize)=>{
    const Users = sequelize.define('Users', {
    username: { 
        type: Sequelize.STRING(50),
        notEmpty: true,
        allowNull: false,
        comment: "Username"
    },
    email: {
        type: Sequelize.STRING(500),
        allowNull: false,
        comment: "Users email"
    },
    password : {
        type:Sequelize.CHAR(64),
        allowNull: false,
        comment: "Uers password"
    }
    },{
        tableName:'users'
    });
    return Users
}