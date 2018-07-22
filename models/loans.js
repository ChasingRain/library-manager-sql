'use strict';
module.exports = (sequelize, DataTypes) => {
  var loans = sequelize.define('loans', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    loaned_on: {
      type: DataTypes.DATE,
      validate: {
        isDate: true
      }
    },
    return_by: {
      type: DataTypes.DATE,
      validate: {
        isDate: true
      }
    },
    returned_on: {
      type: DataTypes.DATE,
      validate: {
        isDate: true
      }
    }
  }, {
    timestamps: false
  });
  loans.associate = (models) => {
    // 1 to 1 with patron_id
    loans.hasMany(models.patrons, {
      targetKey: 'patron_id',
      foreignKey: 'id',
    });
    //1 to 1 with books
    loans.belongsTo(models.books, {
      as: 'book',
      targetKey: 'id',
      foreignKey: 'book_id',
    });
  };
  return loans;
};
