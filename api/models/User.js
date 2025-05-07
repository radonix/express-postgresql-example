export default (sequelize, Sequelize) =>{
    const User = sequelize.define("user",{
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey:true,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    } 
  });
 return User;
}