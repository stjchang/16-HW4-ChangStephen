const dotenv = require('dotenv').config({ path: __dirname + '/../../../.env' });

async function clearTable(model, tableName) {
    try { 
        await model.destroy({ where: {}, truncate: true, cascade: true});
        console.log(tableName + " cleared");
    } catch (err) {
        console.log(err);
    }
}

async function fillTable(model, tableName, data) {
    try {
        await model.bulkCreate(data);
        console.log(tableName + " filled");
    } catch (err) {
        console.log(err);
    }
}

async function resetPostgre() {
    const Playlist = require('../../../models/postgre/playlist-model')(sequelize, DataTypes);
    const User = require("../../../models/postgre/user-model")(sequelize, DataTypes);
    const testData = require("../example-db-data.json");

    console.log("Resetting the PostgreSQL DB");
    await clearTable(Playlist, "Playlist");
    await clearTable(User, "User");
    await fillTable(Playlist, "Playlist", testData.playlists);
    await fillTable(User, "User", testData.users);
}
const sequelize = require('../db/postgre')

sequelize
    .authenticate()
    .then(() => {resetPostgre() })
    .catch(e => {
        console.error('Connection error', e.message)
    })
    
    