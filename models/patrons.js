'use strict';
module.exports = (sequelize, DataTypes) => {
  var patrons = sequelize.define('patrons', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: {
        isInt: true
      }
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: true
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    }
  }, {
    timestamps: false
  });
  patrons.associate = (models) => {
    // 1 to many with board
    patrons.hasMany(models.loans, {
      foreignKey: 'patron_id',
      targetKey: 'id',
    });
  };
  return patrons;
};
