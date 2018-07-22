'use strict';
module.exports = (sequelize, DataTypes) => {
  var books = sequelize.define('books', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    first_published: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
  }, {
    timestamps: false
});

books.associate = (models) => {
  // 1 to many with loans
  books.hasMany(models.loans, {
    foreignKey: 'book_id',
    targetKey: 'id',
  });
};

  return books;
};
