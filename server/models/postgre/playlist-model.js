const { DataTypes, Model } = require('sequelize');

class Playlist extends Model {}

Playlist.columns = {
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
};

module.exports = Playlist;