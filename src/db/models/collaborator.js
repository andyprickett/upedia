'use strict';
module.exports = (sequelize, DataTypes) => {
  var Collaborator = sequelize.define('Collaborator', {
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Collaborator.associate = function(models) {
    // associations can be defined here
    Collaborator.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });
   
    Collaborator.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Collaborator.addScope('collaboratorOn', (userId) => {
      return {
        include: [{
          model: models.Wiki
        }],
        where: { userId: userId },
        order: [["createdAt", "DESC"]]
      }
    });

    Collaborator.addScope('collaboratorsOnWikisOfThisUser', (userId) => {
      return {
        include: [{
          model: models.Wiki,
          required: false,
          where: { userId: userId }
        }],
        order: [["createdAt", "DESC"]]
      }
    });
  };
  return Collaborator;
};