var models  = require('../models');
var Books = require('../models').books;
var Patrons = require('../models').patrons;
var Loans = require('../models').loans;
var express = require('express');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var router  = express.Router();

// copied this function from opensourced code on internet to make sure it incremented mothe and year.
  function addDays(startDate,numberOfDays)
  {
    var returnDate = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate()+numberOfDays,
                startDate.getHours(),
                startDate.getMinutes(),
                startDate.getSeconds());
    return returnDate;
  }

// POST create book
router.post('/create', function(req, res, next) {
  Books.create(req.body,{ validate: true }).then(function(book) {
    res.redirect("/books/all");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("new-books", {error: error.errors})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
;});

// POST update books
router.post('/update', function(req, res, next) {
  Books.update(req.body, {where: {id: req.body.id}}, { validate: true }).then(function(book) {
    res.redirect("/books/all");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        Books.findAll({
          include: [ Loans ],
          where: {
            id: req.params.id
          }
        })
        .then(function(books){
          res.render("details", {books: books, error: error.errors,  title: "Validation Error" });
        })
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
;});

// POST create loan
router.post('/loan/create', function(req, res, next) {
  req.body.loaned_on = new Date();
  req.body.return_by = addDays(new Date(),7);
  Loans.create(req.body,{ validate: true }).then(function(loan) {
    res.redirect("/loans/all");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("new-loan", {error: error.errors})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
;});

// POST update Loans
router.post('/loan/update', function(req, res, next) {
  req.body.returned_on = new Date();
  Loans.update(req.body, {where: {id: req.body.id}}, { validate: true }).then(function(book) {
    res.redirect("/loans/all");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("/", {books: Books.build(req.body), errors: error.errors, title: "New Book"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
;});

//Home
router.get('/', function(req, res, next) {
  Books.findAll().then(function(books){
    res.render("home");
  }).catch(function(error){
      res.send(500, error);
   });
});




//new books
router.get('/books/new', function(req, res, next) {
  Books.findAll().then(function(books){
    res.render("new-books", {books: books, title: "Create New Book" });
  }).catch(function(error){
      res.send(500, error);
   });
});


// book by id
router.get('/books/details/:id', function(req, res, next) {
  Books.findAll({
    include: [ Loans ],
    where: {
      id: req.params.id
    }
  })
  .then(function(books){
    res.render("details", {books: books, title: "List of Books" });
  }).catch(function(error){
      res.send(500, error);
   });
});

//all Books
router.get('/books/all', function(req, res, next) {
  if(req.query.filter){
    Books.findAll({order: [[req.query.filter, req.query.order]], include: [ Loans ]})
    .then(function(books){
      res.render("index", {books: books, title: "List of Books" });
    }).catch(function(error){
        res.send(500, error);
     });
  } else{
  Books.findAll({include: [ Loans ]})
  .then(function(books){
    res.render("index", {books: books, title: "List of Books" });
  }).catch(function(error){
      res.send(500, error);
   });
 }
});

//overdue
router.get('/books/overdue', function(req, res, next) {
  if(req.query.filter){
    Books.findAll({
      order: [[req.query.filter, req.query.order]],
      include: [{
      model: Loans,
      where: {
          return_by: {
            [Op.lt]: new Date()
          }
        }
      }]
    })
    .then(function(books){
      res.render("index", {books: books, title: "List of Overdue Books" });
    }).catch(function(error){
        res.send(500, error);
     });
  } else{
  Books.findAll({
    include: [{
      model: Loans,
      where: {
        return_by: {
          [Op.lt]: new Date()
        },
        returned_on: null
      }
    }]
  })
  .then(function(books){
    res.render("index", {books: books, title: "List of Overdue Books" });
  }).catch(function(error){
      res.send(500, error);
   });
 }
});

//checked out books
router.get('/books/out', function(req, res, next) {
  if(req.query.filter){
    Books.findAll({
      order: [[req.query.filter, req.query.order]],
      include: [{
      model: Loans,
      where: {
        returned_on: null
      }
    }]
  })
  .then(function(books){
    res.render("index", {books: books, title: "List of Books Checked Out" });
  }).catch(function(error){
      res.send(500, error);
   });
 }else {
  Books.findAll({
    include: [{
      model: Loans,
      where: {
        returned_on: null
      }
    }]
  })
  .then(function(books){
    res.render("index", {books: books, title: "List of Books Checked Out" });
  }).catch(function(error){
      res.send(500, error);
   });
 }
});

//all Loans
router.get('/loans/all', function(req, res, next) {
  Loans.findAll({
    include: [{ model: Books, as: 'book' }]
  })
  .then(function(loans){
    res.render("loans", {loans: loans, title: "List of Loans" });
  }).catch(function(error){
      res.send(500, error);
 });
});


// Loans overdue
router.get('/loans/overdue', function(req, res, next) {
  Loans.findAll({
    include: [{ model: Books, as: 'book' }],
    where: {
      return_by: {
        [Op.lt]: new Date()
      },
      returned_on: null
    }
  })
  .then(function(loans){
    res.render("loans", {loans: loans, title: "List of Loans" });
  }).catch(function(error){
      res.send(500, error);
 });
});

// Loans Checked out
router.get('/loans/out', function(req, res, next) {
  Loans.findAll({
    include: [{ model: Books, as: 'book' }],
    where: {
      returned_on: null
    }
  })
  .then(function(loans){
    res.render("loans", {loans: loans, title: "List of Loans" });
  }).catch(function(error){
      res.send(500, error);
 });
});

//new loan
router.get('/loans/new', function(req, res, next) {
  var booklist = [];
  var patronlist = [];
  var date = new Date();
  var returnBy = addDays(date,7);
  Books.findAll().then(function(books){
    booklist = books
    Patrons.findAll().then(function(patrons, books){
    patronlist = patrons;
    res.render("new-loan", {books: booklist, patrons: patronlist, now: date, due: returnBy, title: "Create New Loan" });
    })
  }).catch(function(error){
      res.send(500, error);
   });
});

//return loan
router.get('/loans/:id', function(req, res, next) {
  var date = new Date();
  Loans.findAll({
    include: [{ model: Books, as: 'book' }],
    where: {
      id: req.params.id
    }
  })
  .then(function(loans){
    res.render("loan-details", {loans: loans, now: date, title: "Return Loan" });
  }).catch(function(error){
      res.send(500, error);
 });
});


//all patrons
router.get('/patrons/all', function(req, res, next) {
  Patrons.findAll().then(function(patrons){
    res.render("patrons", {patrons: patrons, title: "List of Patrons" });
  }).catch(function(error){
      res.send(500, error);
   });
});

//patrons details
router.get('/patrons/details/:id', function(req, res, next) {
  Patrons.findAll({
    include: [ Loans ],
    where: {
      id: req.params.id
    }
  })
  .then(function(patrons){
    res.render("patron-details", {patrons: patrons, title: "Patron Details" });
  }).catch(function(error){
      res.send(500, error);
   });
});

//patrons update
router.post('/patron/update', function(req, res, next) {
  Patrons.update(req.body, {where: {id: req.body.id}}, { validate: true }).then(function(patrons) {
    res.redirect("/patrons/all");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("/", {books: Books.build(req.body), errors: error.errors, title: "New Book"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
;});

//POST patrons new
router.post('/patron/new', function(req, res, next) {
  Patrons.create(req.body,{ validate: true }).then(function(patrons) {
    res.redirect("/patrons/all");
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("new-patron", {error: error.errors})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
;});

//new patron
router.get('/patrons/new', function(req, res, next) {
  res.render("new-patron")
  .catch(function(error){
      res.send(500, error);
   });
});

module.exports = router;
