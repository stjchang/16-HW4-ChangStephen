const DatabaseManager = require("../DatabaseManager");
const { Sequelize } = require("sequelize")
const dotenv = require("dotenv");
dotenv.config();

const Playlist = require("../../models/postgre/playlist-model");
const User = require("../../models/postgre/user-model");

class PostgreSQLManager extends DatabaseManager {
    constructor(uri) {
        super();
        this.uri = uri
        this.db = null;
        this.User = User;
        this.Playlist = Playlist;
    }

    async initialize() {
        try {
            // this.db = new Sequelize(uri, {
            //     dialect: "postgres",
            //     logging: false,
            // });

            this.db = new Sequelize(
                process.env.POSTGRES_DB_NAME,
                process.env.POSTGRES_USER,
                process.env.POSTGRES_PASSWORD,
                {
                    host: process.env.POSTGRES_HOST,
                    dialect: "postgres",
                    logging: false,
                }
            )

            User.init(User.columns, { 
                sequelize: this.db, 
                modelName: 'User', 
                timestamps: true 
            });

            Playlist.init(Playlist.columns, { 
                sequelize: this.db, 
                modelName: 'Playlist', 
                timestamps: true 
            });


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
        if (this.db) {
            await this.db.close();
            console.log("postgresql connection closed");
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

    async getPlaylistPairs(ownerEmail) {
        try {
            const playlists = await this.Playlist.findAll({
                where: { ownerEmail: ownerEmail },
                attributes: ['id', 'name'],
                raw: true,
            });

            return playlists.map((playlist) => ({
                _id: playlist.id,
                name: playlist.name,
            }));
        } catch (error) {
            throw error;
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
// module.exports = sequelize;