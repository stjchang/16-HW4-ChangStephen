import { beforeAll, beforeEach, afterEach, afterAll, expect, test } from 'vitest';
const dotenv = require('dotenv').config({ path: __dirname + '/../.env' });
import DatabaseManager from '../server/db/index.js';
const dbManager = new DatabaseManager(process.env.DB_CONNECT);

/**
 * Vitest test script for the Playlister app's Mongo Database Manager. Testing should verify that the Mongo Database Manager 
 * will perform all necessarily operations properly.
 *  
 * Scenarios we will test:
 *  1) Reading a User from the database
 *  2) Creating a User in the database
 *  3) ...
 * 
 * You should add at least one test for each database interaction. In the real world of course we would do many varied
 * tests for each interaction.
 */

/**
 * Executed once before all tests are performed.
 */
beforeAll(async () => {
    // SETUP THE CONNECTION VIA MONGOOSE JUST ONCE - IT IS IMPORTANT TO NOTE THAT INSTEAD
    // OF DOING THIS HERE, IT SHOULD BE DONE INSIDE YOUR Database Manager (WHICHEVER)
    // await mongoose
    //     .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
    //     .catch(e => {
    //         console.error('Connection error', e.message)
    //     })
    await dbManager.initialize();
});

/**
 * Executed before each test is performed.
 */
beforeEach( () => {
});

/**
 * Executed after each test is performed.
 */
afterEach( () => {
});

/**
 * Executed once after all tests are performed.
 */
afterAll(async () => {
    await dbManager.close();
});

/**
 * Vitest test to see if the Database Manager can get a User.
 */
test('Test #1) Reading a User from the Database', async () => {
    // FILL IN A USER WITH THE DATA YOU EXPECT THEM TO HAVE
    const expectedUser = {
        firstName: 'Joe',
        lastName: 'Shmo',
        email: 'joe@shmo.com',
        passwordHash: '$2a$10$dPEwsAVi1ojv2RfxxTpZjuKSAbep7zEKb5myegm.ATbQ4sJk4agGu',
        id: "6909464266375da1f03dcece"
    }

    // THIS WILL STORE THE DATA RETRUNED BY A READ USER
    // const actualUser = {};
    
    // READ THE USER
    // actualUser = dbManager.somethingOrOtherToGetAUser(...)
    const actualUser = await dbManager.getUserByEmail(expectedUser.email);

    // COMPARE THE VALUES OF THE EXPECTED USER TO THE ACTUAL ONE
    expect(expectedUser.firstName, actualUser.firstName)
    expect(expectedUser.lastName, actualUser.lastName);
    // AND SO ON
});

/**
 * Vitest test to see if the Database Manager can create a User
 */
test('Test #2) Creating a User in the Database', async () => {
    // MAKE A TEST USER TO CREATE IN THE DATABASE
    const testUser = {
        // FILL IN TEST DATA, INCLUDE AN ID SO YOU CAN GET IT LATER
        id: '6909464266375da1f03dcece',
        firstName: 'Joe',
        lastName: 'Shmo',
        email: 'joe@shmo.com',
        passwordHash: 'dPEwsAVi1ojv2RfxxTpZjuKSAbep7zEKb5myegm',
    };

    // CREATE THE USER
    // dbManager.somethingOrOtherToCreateAUser(...)

    const createdUser = await dbManager.createUser(testUser);
    // NEXT TEST TO SEE IF IT WAS PROPERLY CREATED

    // FILL IN A USER WITH THE DATA YOU EXPECT THEM TO HAVE
    const expectedUser = {
        id: '6909464266375da1f03dcece',
        firstName: 'Joe',
        lastName: 'Shmo',
        email: 'joe@shmo.com',
        passwordHash: 'dPEwsAVi1ojv2RfxxTpZjuKSAbep7zEKb5myegm',
    };

    // THIS WILL STORE THE DATA RETRUNED BY A READ USER
    // READ THE USER
    // actualUser = dbManager.somethingOrOtherToGetAUser(...)
    const actualUser = await dbManager.getUserById(createdUser.id);

    // COMPARE THE VALUES OF THE EXPECTED USER TO THE ACTUAL ONE
    expect(expectedUser.firstName, actualUser.firstName)
    expect(expectedUser.lastName, actualUser.lastName);
    // AND SO ON
    // THE REST OF YOUR TEST SHOULD BE PUT BELOW

});



test('Test #3) Updating a User in the Database', async () => {
    const testUser = {
        id: '6909464266375da1f03dcece',
        firstName: 'Joe',
        lastName: 'Shmo',
        email: 'joe@shmo.com',
        passwordHash: 'dPEwsAVi1ojv2RfxxTpZjuKSAbep7zEKb5myegm',
    };

    const createdUser = await dbManager.createUser(testUser);
    const userId = createdUser._id || createdUser.id;
    

    const updatedUserObject = {
        id: userId,
        firstName: 'Joseph',
        lastName: 'Shmo',
        email: 'joe@shmo.com',
        passwordHash: 'dPEwsAVi1ojv2RfxxTpZjuKSAbep7zEKb5myegm',

    }

    const updatedUser = await dbManager.updateUserById(userId, updatedUserObject);

    expect(updatedUser).toBeDefined();

    const expectedUser = {
        id: userId,
        firstName: 'Joseph',
        lastName: 'Shmo',
        email: 'joe@shmo.com',
        passwordHash: 'dPEwsAVi1ojv2RfxxTpZjuKSAbep7zEKb5myegm',
    }

    const actualUser = await dbManager.getUserById(updatedUser.id);
    expect(actualUser).toBeDefined();

    expect(expectedUser.firstName, actualUser.firstName)
    expect(expectedUser.lastName, actualUser.lastName);
});

test('Test #4) Deleting a User in the Database', async () => {
   // MAKE A TEST USER TO CREATE IN THE DATABASE
    const testUser = {
        // FILL IN TEST DATA, INCLUDE AN ID SO YOU CAN GET IT LATER
        id: '6909464266375da1f03dcece',
        firstName: 'Joe',
        lastName: 'Shmo',
        email: 'joe@shmo.com',
        passwordHash: 'dPEwsAVi1ojv2RfxxTpZjuKSAbep7zEKb5myegm',
    };

    // CREATE THE USER
    // dbManager.somethingOrOtherToCreateAUser(...)

    const createdUser = await dbManager.createUser(testUser);
    // NEXT TEST TO SEE IF IT WAS PROPERLY CREATED


    // THIS WILL STORE THE DATA RETRUNED BY A READ USER
    // READ THE USER
    // actualUser = dbManager.somethingOrOtherToGetAUser(...)
    const deletedUser = await dbManager.deleteUserById(createdUser.id);
    expect(deletedUser).toBeDefined();
    // CHECKED TO SEE IF WE DELETED AN ACTUAL USER (SHOULD RETURN A DEFINED OBJECT)
    const actualUser = await dbManager.getUserById(createdUser.id);
    expect(actualUser).toBeDefined();

    // WHEN SEARCHING FOR THE USER, IT IS DELETED.
    expect(await dbManager.getUserById(createdUser.id)).toBeNull();
    
});

test('Test #5) Creating a Playlist in the Database', async () => {
    // CREATE TEST DATA
    const testPlaylist = {
        id: '68f526c1ec1ea2ad00a6fae0',
        name: 'Test Playlist',
        ownerEmail: 'joe@shmo.com',
        songs: [
            {
                title: 'Across the Universe',
                artist: 'The Beatles',
                year: 1969,
                youTubeId: '90M60PzmxEE'
            }
        ]
    };

    // CREATE THE PLAYLIST
    const createdPlaylist = await dbManager.createPlaylist(testPlaylist);
    
    expect(createdPlaylist).toBeDefined();

    // CREATE EXPECTED PLAYLIST DATA
    const expectedPlaylist = {
        id: '68f526c1ec1ea2ad00a6fae0',
        name: 'Test Playlist',
        ownerEmail: 'joe@shmo.com',
        songs: [
            {
                title: 'Across the Universe',
                artist: 'The Beatles',
                year: 1969,
                youTubeId: '90M60PzmxEE'
            }
        ]
    };

    // READ THE PLAYLIST BY ID
    const actualPlaylist = await dbManager.getPlaylistById(createdPlaylist.id);
    expect(actualPlaylist).toBeDefined();

    expect(expectedPlaylist.name, actualPlaylist.name);
    expect(expectedPlaylist.ownerEmail, actualPlaylist.ownerEmail);
    expect(expectedPlaylist.songs, actualPlaylist.songs);
});

test('Test #6) Deleting a Playlist in the Database', async () => {
    const testPlaylist = {
        id: '68f526c1ec1ea2ad00a6fae0',
        name: 'Test Playlist',
        ownerEmail: 'joe@shmo.com',
        songs: [
            {
                title: 'Across the Universe',
                artist: 'The Beatles',
                year: 1969,
                youTubeId: '90M60PzmxEE'
            }
        ]
    };

    const createdPlaylist = await dbManager.createPlaylist(testPlaylist);

    const deletedPlaylist = await dbManager.deletePlaylistById(createdPlaylist.id);
    expect(deletedPlaylist).toBeDefined();

    const actualPlaylist = await dbManager.getPlaylistById(createdPlaylist.id);
    expect(actualPlaylist).toBeNull();
});

test('Test #7) Getting Playlist in the Database', async () => {
    const expectedPlaylist = {
        id: '68f526c1ec1ea2ad00a6fae0',
        name: 'Test Playlist',
        ownerEmail: 'joe@shmo.com',
        songs: [
            {
                title: 'Across the Universe',
                artist: 'The Beatles',
                year: 1969,
                youTubeId: '90M60PzmxEE'
            }
        ]
    };

    const actualPlaylist = await dbManager.getPlaylistById(expectedPlaylist.id);
    expect(actualPlaylist).toBeDefined();

    expect(expectedPlaylist.name, actualPlaylist.name);
    expect(expectedPlaylist.ownerEmail, actualPlaylist.ownerEmail);
    expect(expectedPlaylist.songs, actualPlaylist.songs);
});
