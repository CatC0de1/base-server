const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
// const fs = require('fs');
// const bodyParser = require('body-parser');

class BaseServer {
  constructor(port, mongoDB) {
    this.port = port;
    this.mongoDB = mongoDB;
    this.app = express();
    this.initMiddleware();
    this.connectDatabase();
  }

  initMiddleware() {
    this.app.use(cors({
      origin: ['http://localhost:3002', 'http://localhost:3004']
    }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  connectDatabase() {
    mongoose.connect(`${this.mongoDB}`, {})
      .then(() => console.log('Berhasil terkoneksi ke MongoDB Atlas'))
      .catch((err) => console.error('Gagal terkoneksi ke MongoDB Atlas', err));
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server berjalan di http://localhost:${this.port}`);
    });
  }
}

module.exports = BaseServer;