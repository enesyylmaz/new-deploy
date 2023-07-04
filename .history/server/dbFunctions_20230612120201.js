const { ObjectId } = require("mongodb");
const dbName = "users";
const coll = "names";
let db;

module.exports = {
  getDb: async (client) => {
    db = await client.db(dbName);
  },

  getAllDocs: async () => {
    return await db.collection(coll).find().toArray();
  },

  addDoc: async (doc) => {
    return await db.collection(coll).insertOne(doc);
  },

  deleteDoc: async (id) => {
    const filter = { _id: new ObjectId(id) };
    return await db.collection(coll).deleteOne(filter);
  },

  getUserById: async (id) => {
    const filter = { _id: new ObjectId(id) };
    return await db.collection(coll).findOne(filter);
  },

  editUserData: async (id, voted) => {
    const filter = { _id: new ObjectId(id) };
    const update = { $set: { voted: Boolean(voted) } };
    return await db.collection(coll).updateOne(filter, update);
  },
};
