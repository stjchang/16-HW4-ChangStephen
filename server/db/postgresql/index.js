const DatabaseManager = require("../DatabaseManager");
const sequelize = require("sequilize")
const dotenv = require("dotenv");
dotenv.config();

const Playlist = require("../../models/postgreql/playlist-model");
const User = require("../../models/postgresql/user-model");

class PostgreSQLManager extends DatabaseManager {
    constructor(uri) {
        super();
        this.uri = uri
        this.db = null;
        this.User = null;
        this.Playlist = null;
    }

    async initialize() {
        try {
            this.db = new sequelize(uri, {
                dialect: "postgres",
                logging: false,
            });

            this.User = User(this.db);
            this.Playlist = Playlist(this.db);

            this.User.hasMany(this.Playlist, {
                foreignKey: "ownerEmail",
                sourceKey: "email",
                as: 'playlists',
                onDelete: 'CASCADE',
            }); 

            this.Playlist.belongsTo(this.User, {
                foreignKey: "ownerEmail",
                targetKey: "email",
                as: 'owner',
            });

            await this.db.sync({force: false});
            console.log("postgresql connected");

        } catch (error) {
            console.error('PostgreSQL connection error: ', error.message);
            throw error;
        }
        
    }

    async close() {
        try {
            await this.db.close();
            console.log("postgresql connection closed");
        } catch (error) {
            console.error('Error disconnecting postgresql: ', error.message);
        }
    }

    //users

    async getUserByEmail(email) {
        return await this.User.findOne({where: { email }});
    }

    async getUserById(id) {
        return await this.User.findByPk(id);
    }
    

    async createUser(userObject) {
        return await this.User.create(userObject);
    }

    async updateUserById(id, userObject) {
        const updatedUser = await this.User.update(userObject, {
            where: { id },
            returning: true
        })
        return updatedUser
    }

    async deleteUserById(id) {
        return await User.destroy({ where: { id }});
    }

    //playlists

    async createPlaylist(playlistObject) {
        return await this.Playlist.create(playlistObject);
    }

    async deletePlaylistById(id) {
        return await this.Playlist.destroy({ where: { id }});
    }

    async getPlaylistById(id) { 
        return await this.Playlist.findByPk(id);
    }

    async getAllPlaylists() {
        return await this.Playlist.findAll();
    }

    async getPlaylistPairs() {
        try {
            const playlists = await this.Playlist.findAll({
                attributes: ['id', 'name'],
            });

            return playlists.map((playlist) => ({
                _id: playlist.id,
                name: playlist.name,
            }));
        } catch (error) {
            console.error('getPlaylistPairs error: ', error.message);
        }
    }

    async updatePlaylistById(id, playlistObject) {
        const updatedPlaylist = await this.Playlist.update(playlistObject, {
            where: { id },
            returning: true
        })
        return updatedPlaylist
    }
        
}

module.exports = PostgreSQLManager;