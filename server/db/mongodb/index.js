
const DatabaseManager = require("../DatabaseManager");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Playlist = require("../../models/mongo/playlist-model");
const User = require("../../models/mongo/user-model");

class MongoDBManager extends DatabaseManager {
    constructor() {
        super();
        this.db = null;
    }

    async initialize() {
        try {
            await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
            this.db = mongoose.connection;
            console.log("mongodb connected");
        } catch (error) {
            console.error('Connection error', error.message);
        }
    }

    async close() {
        try {
            await mongoose.connection.close();
            console.log("mongodb connection closed");
        } catch (error) {
            console.error('error disconnecting mongodb: ', error.message);
        }
    }

    //user
    async getUserByEmail(email) {
        return await User.findOne({ email });
    }
    
    async getUserById(id) {
        return await User.findById(id);
    }

    async createUser(userObject) {
        return new User(userObject);
        
    }

    async updateUserById(id, userObject) {
        try {
            return await User.findByIdAndUpdate(id, userObject, { new: true }).lean();
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async deleteUserById(id) {
        return User.findByIdAndDelete(id);
    }

    async createPlaylist(playlistObject) {
        const createdPlaylist = new Playlist(playlistObject);
        return createdPlaylist.save();
    }

    async deletePlaylistById(id) {
        return Playlist.findByIdAndDelete(id);
    }

    async getPlaylistById(id) {
        try {
            const playlist = await Playlist.findById(id);
            return playlist;
        } catch (error) {
            console.error('getPlaylistById error: ', error.message);
            throw error;
        }
        
    }

    async getAllPlaylists() {
        try {
            return await Playlist.find({});
        } catch (error) {
            console.error('getAllPlaylists error: ', error.message);
            throw error;
        }
    }

    async getPlaylistPairs() {
        try {
            const playlists = await Playlist.find({}, '_id name');
            return playlists.map((playlist) => ({
                _id: playlist._id,
                name: playlist.name,
            }));
        } catch (error) {
            console.error('getPlaylistPairs error: ', error.message);
        }
    }

    async updatePlaylistById(id, playlistObject) {
        return await Playlist.findByIdAndUpdate(id, playlistObject, { new: true }).lean();
    }
}

module.exports = new MongoDBManager();