const { DataTypes } = require('sequelize');
const sequelize = require('../../db/postgre');

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

module.exports = Playlist;
