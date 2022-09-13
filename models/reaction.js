'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Users, Message}) {
        this.belongsTo(Message,{foreignKey: 'messageId'})
        this.belongsTo(Users, {foreignKey: 'userId'})
    }
  }
  Reaction.init({
    content: {
      type:DataTypes.STRING,
      allowNull: false
    },
    uuid: {
      type:DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    messageId:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false
    }

  }, {
    sequelize,
    modelName: 'Reaction',
    tableName: 'reactions'
  });
  return Reaction;
};