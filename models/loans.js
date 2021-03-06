'use strict';
var moment = require('moment');
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
      type: DataTypes.DATEONLY,
      get: function() {
        return moment.utc(this.getDataValue('loaned_on')).format('YYYY-MM-DD')
      },
      validate: {
        isDate: true
      }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      get: function() {
        return moment.utc(this.getDataValue('return_by')).format('YYYY-MM-DD')
      },
      validate: {
        isDate: true
      }
    },
    returned_on: {
      type: DataTypes.DATEONLY,
      get: function() {
        return moment.utc(this.getDataValue('returned_on')).format('YYYY-MM-DD')
      },
      validate: {
        isDate: true
      }
    }
  }, {
    timestamps: false
  });
  loans.associate = (models) => {
    // 1 to 1 with patron_id
    loans.belongsTo(models.patrons, {
      targetKey: 'id',
      foreignKey: 'patron_id',
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
