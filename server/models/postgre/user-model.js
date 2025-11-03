const { DataTypes } = require('sequelize');
const sequelize = require('../../db/postgre');
const playlist = require('./playlist-model');

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

User.hasMany(Playlist, {
    foreignKey: 'ownerEmail',
    sourceKey: 'email',
    as: 'playlists',
    onDelete: 'CASCADE'
});

Playlist.belongsTo(User, {
    foreignKey: 'ownerEmail',
    targetKey: 'email',
    as: 'owner'
});

module.exports = User;