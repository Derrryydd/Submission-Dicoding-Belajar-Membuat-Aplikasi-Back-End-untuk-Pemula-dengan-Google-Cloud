const { nanoid } = require('nanoid');
const books = require('./books');

const createBooks = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (name === undefined) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    res.code(400);
    return res;
  }

  if (pageCount < readPage) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);
    return res;
  }

  const id = nanoid(10);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const bookIndex = books.filter((book) => book.id === id).length > 0;

  if (bookIndex) {
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    res.code(201);
    return res;
  }
  const res = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  res.code(500);
  return res;
};

const getBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  let index = books;

  if (name) {
    index = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading) {
    index = books.filter((book) => Number(book.reading) === Number(reading));
  }

  if (finished) {
    index = books.filter((book) => Number(book.finished) === Number(finished));
  }

  const res = h.response({
    status: 'success',
    data: {
      books: index.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  res.code(200);
  return res;
};

const getBooksId = (request, h) => {
  const { id } = request.params;

  const book = books.filter((book) => book.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const res = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  res.code(404);
  return res;
};

const editBooksId = (request, h) => {
  const { id } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const updatedAt = new Date().toISOString();
  const bookIndex = books.findIndex((book) => book.id === id);

  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    res.code(400);
    return res;
  }

  if (pageCount < readPage) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);
    return res;
  }

  if (bookIndex !== -1) {
    const finished = pageCount === readPage;

    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const res = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

const deleteBooksId = (request, h) => {
  const { id } = request.params;
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

module.exports = {
  createBooks,
  getBooks,
  getBooksId,
  editBooksId,
  deleteBooksId,
};
