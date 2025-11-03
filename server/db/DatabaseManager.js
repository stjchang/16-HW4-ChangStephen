class DatabaseManager {
    async initialize() {
        throw new Error("initialize() not implemented");
    }

    async close() {
        throw new Error("close() not implemented");
    }

    //users

    async getUserByEmail(email) {
        throw new Error("getUserByEmail() not implemented");
    }

    async getUserById(id) {
        throw new Error("getUserById() not implemented");
    }

    async createUser(userObject) {
        throw new Error("createUser() not implemented");
    }

    // dont want to update by email incase the email is being changed

    async updateUserById(id, userObject) {
        throw new Error("updateUserById() not implemented");
    }

    async deleteUserById(id) {
        throw new Error("deleteUserById() not implemented");
    }

    //playlists

    async createPlaylist(playlistObject) {
        throw new Error("createPlaylist() not implemented");
    }

    async deletePlaylistById(id) {
        throw new Error("deletePlaylistById() not implemented");
    }

    async getPlaylistById(id) { 
        throw new Error("getPlaylistById() not implemented");
    }

    async getPlaylistPairs() {
        throw new Error("getPlaylistPairs() not implemented");
    }

    async updatePlaylistById(id, playlistObject) {
        throw new Error("updatePlaylistById() not implemented");
    }
}

module.exports = DatabaseManager;