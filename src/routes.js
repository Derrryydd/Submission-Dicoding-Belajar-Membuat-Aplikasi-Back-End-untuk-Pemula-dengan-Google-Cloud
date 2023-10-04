const { createBooks, getBooks, getBooksId, editBooksId, deleteBooksId } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: createBooks,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBooks,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBooksId,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBooksId,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBooksId,
  },
];

module.exports = routes;
