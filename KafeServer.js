const { default: mongoose } = require('mongoose');
const BaseServer = require('./baseServer');

class KafeServer extends BaseServer {
  constructor(port, mongoDB) {
    super(port, mongoDB);
    this.initRoutes();
  }

  initRoutes() {
    // this.app.get('/api/kafe', this.getKafeData.bind(this));
    this.app.get('/api/allCollections', this.getAllCollections.bind(this));
    this.app.get('/api/collections/:collectionName', this.getCollectionData.bind(this));
    this.app.get('/api/:collectionName/:id', this.getItemById.bind(this));
  }

  // loadKafeData() {
  //   const filePath = path.join(__dirname, 'kafe.json');
  //   const data = fstat.readFileSync(filePath, 'utf-8');
  //   return JSON.parse(data);
  // }

  // getKafeData(req, res) {
  //   try {
  //     const kafeFata = this.loadKafeData();
  //     res.json(kafeData)
  //   } catch (error) {
  //     res.status(500).send('Error membaca data kafe');
  //   }
  // }

  async getAllCollections(req, res) {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      const result = {};

      for (const collection of collections) {
        const collectionName = collection.name;
        const data = await mongoose.connection.db.collection(collectionName).find({}).toArray();
        result[collectionName] = data;
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Gagal mendapatkan semua koleksi' });
    }
  }

  async getCollectionData(req, res) {
    const { collectionName } = req.params;
    try {
      const collection = mongoose.connection.db.collection(collectionName);
      const data = await collection.find({}).toArray();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: `Gagal mendapatkan data dari koleksi ${collectionName}` });
    }
  }

  async getItemById(req, res) {
    const { collectionName, id } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID tidak valid'});
      }

      const collection = mongoose.connection.db.collection(collectionName);
      const item = await collection.findOne({ _id: new mongoose.Types.ObjectId(id) });

      if (!item) {
        return res.status(404).json({ error: 'Item tidak ditemukan' });
      }

      res.json(item);
    } catch (error) {
      console.error('Error fetching item: ', error);
      res.status(500).json({ error: 'Gagal mendapatkan data item'});
    }
  }
}

module.exports = KafeServer;