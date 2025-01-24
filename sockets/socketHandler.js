import Message from '../models/message.js';

const activeUsers = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Join a user with their user ID
    socket.on('join', (userId) => {
      activeUsers.set(userId, socket.id);
      console.log(`User ${userId} is now online with socket ID: ${socket.id}`);
    });

    // Send a message
    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
      const newMessage = await Message.create({
        senderId,
        receiverId,
        message,
      });

      const receiverSocketId = activeUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', newMessage);
        console.log(`Message sent from ${senderId} to ${receiverId}`);
      } else {
        console.log(`User ${receiverId} is offline. Message saved.`);
      }
    });

    // Mark messages as read
    socket.on('markAsRead', async ({ userId, senderId }) => {
      await Message.updateMany(
        { receiverId: userId, senderId, isRead: false },
        { $set: { isRead: true } }
      );
      console.log(`Messages from ${senderId} to ${userId} marked as read`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const userId = [...activeUsers.entries()].find(([_, id]) => id === socket.id)?.[0];
      if (userId) {
        activeUsers.delete(userId);
        console.log(`User ${userId} disconnected.`);
      }
    });
  });
};

export default socketHandler;
