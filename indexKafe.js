const KafeServer = require('./KafeServer');

const port = 5000;
const mongoURI = 'mongodb+srv://Kafe:3S85aVgSdgfxYVaB@cluster0.ojr60.mongodb.net/Kafe?retryWrites=true&w=majority';

const server = new KafeServer(port, mongoURI);
server.start();