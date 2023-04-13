const { nanoid } = require('nanoid');
const books = require('./books');

const insertBookHandler = (request, h) => {
  const {name, year, author, summary, publisher, pageCount, readPage, reading,} = request.payload;

  if (!name) {
    return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400);
  }
  
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = 
  {name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt,
  };

  books.push(newBook); 

  const isSuccess = books.filter((note) => note.id === id).length > 0; // cek if newBook pushed

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      }
    }).code(201);
  }

  const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    }).code(500);
  
    return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (!name && !reading && !finished) {
    // kalau tidak ada query
    const response = h.response({
        status: 'success',
        data: {
          books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      }).code(200);

    return response;
  }

  if (name) {
    const filteredBooksName = books.filter((book) => {
      const nameRegex = new RegExp(name, 'gi');
      return nameRegex.test(book.name);
    });

    return h.response({
        status: 'success',
        data: {
          books: filteredBooksName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      }).code(200);
  }

  if (reading) {
    // kalau ada query reading
    const filteredBooksReading = books.filter(
      (book) => Number(book.reading) === Number(reading),
    );

    return h.response({
        status: 'success',
        data: {
          books: filteredBooksReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      }).code(200);
  }

  const filteredBooksFinished = books.filter(
    (book) => Number(book.finished) === Number(finished),
  );

  return h.response({
      status: 'success',
      data: {
        books: filteredBooksFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);
};

const findBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0]; // find book by id

  if (book) {
    // Bila buku dengan id yang dilampirkan ditemukan
    const response = h
      .response({
        status: 'success',
        data: {
          book,
        },
      })
      .code(200);
    return response;
  }

  // Bila buku dengan id yang dilampirkan oleh client tidak ditemukan
  const response = h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
  return response;
};

const modifyBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {name, year, author, summary, publisher, pageCount, readPage, reading,} = request.payload;

  if (!name) {
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
    return response;
  }

  if (readPage > pageCount) {
    return h.response({
        status: 'fail',
        message:'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((note) => note.id === bookId); // find book by id

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    // Bila buku berhasil diperbarui
    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      }).code(200);
  }

  return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
};

const eraseBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    }).code(200);

    return response;
  }
  return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
};

module.exports = {
  insertBookHandler,
  getAllBooksHandler,
  findBookByIdHandler,
  modifyBookByIdHandler,
  eraseBookByIdHandler,
};