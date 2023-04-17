const { Server, Socket } = require('socket.io');
const consola = require('consola');

const roomController = require('../controllers/roomController');
const tradeController = require('../controllers/tradeController');

function showPlayers(socket, result) {
  socket.emit('response_room', result);
  socket.broadcast.emit('response_room', result);
}

exports.app = (app) => {
  const io = new Server(app, {
    transports: ['websocket'], // To avoid sticky sessions when using multiple servers
    path: '/classic-mode',
    cors: {
      origin: 'http://localhost:3000',
    },
    rememberUpgrade: true,
  });

  consola.info('Socketio initialised!');

  const classicMode = io.of('/classic-mode');
  classicMode.on('connection', async (socket) => {
    let round = 1;
    const room = ({ username, roomId, password, flag } =
      socket.handshake.query);
    const result = await roomController.getUserByRoom(room);

    // Next Round
    socket.on('request_round', async (data) => {});
    round = round + 1;
    socket.broadcast.emit('response_round', round);

    showPlayers(socket, result);

    socket.on('isReady', async (func) => {
      let modifyState = await roomController.modifyRoom(func);
      showPlayers(socket, modifyState);
    });

    socket.on('start_game', async (data) => {
      let result = await roomController.getFinalUser(data);
      socket.broadcast.emit('game_started', result);
      socket.emit('game_started', result);
    });

    // Request Trade
    socket.on('requestTrade', async (data) => {
      const result = await tradeController.createTrade(data);
      if (result.code === 200) socket.broadcast.emit('newTrade', result);
      else socket.emit('newTrade', result);
    });

    // Accept Trade
    socket.on('acceptTrade', async (data) => {
      const result = await tradeController.acceptTrade(data);
      socket.emit('successTrade', result);
    });

    // Reject Trade
    socket.on('rejectTrade', async (data) => {
      const result = await tradeController.rejectTrade(data);
      socket.emit('returnTrade', result);
    });
  });

  return io;
};
