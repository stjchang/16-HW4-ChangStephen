const dotenv = require('dotenv').config({ path: __dirname + '/../../../.env' });
const testData = require("../example-db-data.json");
const PostgreSQLManager = require('../../../db/postgresql');


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
        const convertedData = data.map(item => {
            const converted = { ...item };
            if (converted._id) {
                delete converted._id;
            }
            return converted;
        });
        await model.bulkCreate(convertedData);
    } catch (err) {
        if (err.errors) {
            console.error('postgre fillTable errors:', err.errors);
        }
    }
}

async function resetPostgre() {
    // const sequelize = new Sequelize(process.env.DB_CONNECT, {
    //     dialect: "postgres",
    //     logging: false,
    // });

    const dbManager = new PostgreSQLManager();
    await dbManager.initialize();


    console.log("Resetting the PostgreSQL DB");

    // await sequelize.authenticate();
    // await sequelize.sync({ force: false });

    await clearTable(dbManager.Playlist, "Playlist");
    await clearTable(dbManager.User, "User");
    await fillTable(dbManager.User, "User", testData.users);
    await fillTable(dbManager.Playlist, "Playlist", testData.playlists);
    
    await dbManager.close();
}

resetPostgre()
    .catch(e => {
        console.error('Connection error', e.message)
    })
    
    