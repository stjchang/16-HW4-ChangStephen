const dotenv = require('dotenv').config({ path: __dirname + '/../../../.env' });
const { Sequelize, DataTypes } = require('sequelize');

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
    const sequelize = new Sequelize(process.env.DB_CONNECT, {
        dialect: "postgres",
        logging: false,
    });

    const User = sequelize.define('User', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false  
        }
    }, {
        timestamps: true
    });

    const Playlist = sequelize.define('Playlist', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ownerEmail: {
            type: DataTypes.STRING,
            allowNull: false
        },
        songs: {
            type: DataTypes.JSONB,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    const testData = require("../example-db-data.json");

    console.log("Resetting the PostgreSQL DB");
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    await clearTable(Playlist, "Playlist");
    await clearTable(User, "User");
    await fillTable(Playlist, "Playlist", testData.playlists);
    await fillTable(User, "User", testData.users);
    
    await sequelize.close();
}

resetPostgre()
    .catch(e => {
        console.error('Connection error', e.message)
    })
    
    