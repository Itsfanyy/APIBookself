const {
    insertBookHandler,
    getAllBooksHandler,
    findBookByIdHandler,
    modifyBookByIdHandler,
    eraseBookByIdHandler,
  } = require('./handler');
  
  const routes = [
    {
      method: 'POST',
      path: '/books',
      handler: insertBookHandler
    },
    {
      method: 'GET',
      path: '/books',
      handler: getAllBooksHandler
    },
    {
      method: 'GET',
      path: '/books/{bookId}',
      handler: findBookByIdHandler
    },
    {
      method: 'PUT',
      path: '/books/{bookId}',
      handler: modifyBookByIdHandler
    },
    {
      method: 'DELETE',
      path: '/books/{bookId}',
      handler: eraseBookByIdHandler
    },
    {
      method: '*',
      path: '/{any*}',
      handler: () => 'Page not found'
    }
  ];  
  
  module.exports = routes;