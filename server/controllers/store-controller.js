// const Playlist = require('../models/playlist-model')
// const User = require('../models/user-model');
const auth = require('../auth')
const db = require('../db');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    try {
        const user = db.getUserById(req.userId)
        if(!user) {
            return res.status(404).json({
                errorMessage: 'User not found'
            })
        }  

        const playlist = new db.createPlaylist(body);
        // const playlist = new Playlist(body);
        console.log("playlist: " + playlist.toString());
        if (!playlist) {
            return res.status(400).json({ success: false, error: err })
        }
        user.playlists.push(playlist._id);
        db.updateUserById(user._id, user);

        return res.status(201).json({
            playlist: playlist
        })
    } catch (error) {
        return res.status(500).json({
            errorMessage: 'playlist could not be created'
        })
    }


    // User.findOne({ _id: req.userId }, (err, user) => {
    //     console.log("user found: " + JSON.stringify(user));
    //     user.playlists.push(playlist._id);
    //     user
    //         .save()
    //         .then(() => {
    //             playlist
    //                 .save()
    //                 .then(() => {
    //                     return res.status(201).json({
    //                         playlist: playlist
    //                     })
    //                 })
    //                 .catch(error => {
    //                     return res.status(400).json({
    //                         errorMessage: 'Playlist Not Created!'
    //                     })
    //                 })
    //         });
    // })
}
deletePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);

    // Playlist.findById({ _id: req.params.id }, (err, playlist) => {
    //     console.log("playlist found: " + JSON.stringify(playlist));
    //     if (err) {
    //         return res.status(404).json({
    //             errorMessage: 'Playlist not found!',
    //         })
    //     }

    const playlist = db.getPlaylistById(req.params.id);
    if (!playlist) {
        return res.status(404).json({
            errorMessage: 'Playlist not found'
        })
    }

    const owner = await db.getUserByEmail(playlist.ownerEmail);

    if (owner._id != req.userId) { 
        console.log("incorrect user!");
        return res.status(400).json({
            errorMessage: 'Authentication error'
        })
    }

    const deletedPlaylist = await db.deletePlaylistById(req.params.id);
    if (!deletedPlaylist) {
        return res.status(500).json({
            errorMessage: 'Playlist could not be deleted'
        })
    }
    return res.status(200).json({});

        // DOES THIS LIST BELONG TO THIS USER?
    


        // async function asyncFindUser(list) {
        //     User.findOne({ email: list.ownerEmail }, (err, user) => {
        //         console.log("user._id: " + user._id);
        //         console.log("req.userId: " + req.userId);
        //         if (user._id == req.userId) {
        //             console.log("correct user!");
        //             // Playlist.findOneAndDelete({ _id: req.params.id }, () => {
        //             db.deletePlaylistById(req.params.id).then(() => {
        //                 return res.status(200).json({});
        //             }).catch(err => console.log(err))
        //         }
        //         else {
        //             console.log("incorrect user!");
        //             return res.status(400).json({ 
        //                 errorMessage: "authentication error" 
        //             });
        //         }
        //     });
        // }

}

getPlaylistById = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    const playlist = await db.getPlaylistById(req.params.id);
    if (!playlist) {
        return res.status(404).json({
            errorMessage: 'Playlist not found'
        })
    }
    console.log("Found playlist: " + JSON.stringify(playlist));

    async function asyncFindUser(list) {
        const user = await db.getUserByEmail(list.ownerEmail);
        if (!user) {
            return res.status(404).json({
                errorMessage: 'User not found'
            })
        }

        console.log("user._id: " + user._id);
        console.log("req.userId: " + req.userId);

        if (user._id == req.userId) {
            console.log("correct user!");
            const deletedPlaylist = await db.deletePlaylistById(req.params.id);
            if (!deletedPlaylist) {
                return res.status(500).json({
                    errorMessage: 'Playlist could not be deleted'
                })
            }
            return res.status(200).json({});
        }
        else {
            console.log("incorrect user!");
            return res.status(400).json({ 
                errorMessage: "authentication error" 
            });
        }
    }

    asyncFindUser(playlist);

    // await Playlist.findById({ _id: req.params.id }, (err, list) => {
    //     if (err) {
    //         return res.status(400).json({ success: false, error: err });
    //     }
    //     console.log("Found list: " + JSON.stringify(list));

    //     // DOES THIS LIST BELONG TO THIS USER?
    //     async function asyncFindUser(list) {
    //         User.findOne({ email: list.ownerEmail }, (err, user) => {
    //             console.log("user._id: " + user._id);
    //             console.log("req.userId: " + req.userId);
    //             if (user._id == req.userId) {
    //                 console.log("correct user!");
    //                 // Playlist.findOneAndDelete({ _id: req.params.id }, () => {
    //                 db.deletePlaylistById(req.params.id).then(() => {
    //                     return res.status(200).json({});
    //                 }).catch(err => console.log(err))
    //             }
    //             else {
    //                 console.log("incorrect user!");
    //                 return res.status(400).json({ 
    //                     errorMessage: "authentication error" 
    //                 });
    //             }
    //         });
    //     }
    //     asyncFindUser(list);
    // }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("getPlaylistPairs");

    try {
        const pairs = await db.getPlaylistPairs();

        if(!pairs || pairs.length === 0) {
            return res.status(404).json({
                errorMessage: 'No playlists found'
            })
        }

        return res.status(200).json({success: true, idNamePairs: pairs });
    } catch (error) {
        return res.status(500).json({   
            success: false,
            errorMessage: 'Could not retrieve playlist pairs'
        });
    }


    // await User.findOne({ _id: req.userId }, (err, user) => {
    //     console.log("find user with id " + req.userId);
    //     async function asyncFindList(email) {
    //         console.log("find all Playlists owned by " + email);
    //         await Playlist.find({ ownerEmail: email }, (err, playlists) => {
    //             console.log("found Playlists: " + JSON.stringify(playlists));
    //             if (err) {
    //                 return res.status(400).json({ success: false, error: err })
    //             }
    //             if (!playlists) {
    //                 console.log("!playlists.length");
    //                 return res
    //                     .status(404)
    //                     .json({ success: false, error: 'Playlists not found' })
    //             }
    //             else {
    //                 console.log("Send the Playlist pairs");
    //                 // PUT ALL THE LISTS INTO ID, NAME PAIRS
    //                 let pairs = [];
    //                 for (let key in playlists) {
    //                     let list = playlists[key];
    //                     let pair = {
    //                         _id: list._id,
    //                         name: list.name
    //                     };
    //                     pairs.push(pair);
    //                 }
    //                 return res.status(200).json({ success: true, idNamePairs: pairs })
    //             }
    //         }).catch(err => console.log(err))
    //     }
    //     asyncFindList(user.email);
    // }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const playlists = await db.getAllPlaylists();
    if (!playlists || playlists.length === 0) {
        return res.status(404).json({
            sucess: false, 
            errorMessage: 'Playlists not found '
        })
    }
    return res.status(200).json({ success: true, data: playlists});

    // await Playlist.find({}, (err, playlists) => {
    //     if (err) {
    //         return res.status(400).json({ success: false, error: err })
    //     }
    //     if (!playlists.length) {
    //         return res
    //             .status(404)
    //             .json({ success: false, error: `Playlists not found` })
    //     }
    //     return res.status(200).json({ success: true, data: playlists })
    // }).catch(err => console.log(err))
}
updatePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    try {
        // see if playlist exists
        const existingPlaylist = await db.getPlaylistById(req.params._id);
        if (!existingPlaylist) {
            return res.status(404).json({
                errorMessage: 'Playlist not found'
            })
        }

        // see if user exists
        const owner = await db.getUserByEmail(existingPlaylist.ownerEmail);
        if (!owner) {
            return res.status(404).json({
                errorMessage: 'User not found'
            })
        }

        // if user is owner then update
        if (owner._id != req.userId) {
            return res.status(400).json({
                errorMessage: 'Authentication error'
            })
        }

        const updatedPlaylist = {
            name: body.name,
            songs: body.songs,
            ownerEmail: existingPlaylist.ownerEmail
        };

        await db.updatePlaylistById(req.params._id, updatedPlaylist);

        return res.status(200).json({   
            success: true,
            playlist: updatedPlaylist
        });
    } catch (error) {
        return res.status(500).json({   
            success: false,
            errorMessage: 'Could not update playlist'
        });
    }

    // Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
    //     console.log("playlist found: " + JSON.stringify(playlist));
    //     if (err) {
    //         return res.status(404).json({
    //             err,
    //             message: 'Playlist not found!',
    //         })
    //     }

    //     // DOES THIS LIST BELONG TO THIS USER?
    //     async function asyncFindUser(list) {
    //         await User.findOne({ email: list.ownerEmail }, (err, user) => {
    //             console.log("user._id: " + user._id);
    //             console.log("req.userId: " + req.userId);
    //             if (user._id == req.userId) {
    //                 console.log("correct user!");
    //                 console.log("req.body.name: " + req.body.name);

    //                 list.name = body.playlist.name;
    //                 list.songs = body.playlist.songs;
    //                 list
    //                     .save()
    //                     .then(() => {
    //                         console.log("SUCCESS!!!");
    //                         return res.status(200).json({
    //                             success: true,
    //                             id: list._id,
    //                             message: 'Playlist updated!',
    //                         })
    //                     })
    //                     .catch(error => {
    //                         console.log("FAILURE: " + JSON.stringify(error));
    //                         return res.status(404).json({
    //                             error,
    //                             message: 'Playlist not updated!',
    //                         })
    //                     })
    //             }
    //             else {
    //                 console.log("incorrect user!");
    //                 return res.status(400).json({ success: false, description: "authentication error" });
    //             }
    //         });
    //     }
    //     asyncFindUser(playlist);
    // })
}
module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist
}