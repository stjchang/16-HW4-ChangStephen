const { DataTypes } = require('sequelize');
const sequelize = require('../../db/postgresql');
const Playlist = require('../playlist-model');

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

module.exports = User;