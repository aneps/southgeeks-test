const { database } = require('../config/firebase');
const { ref, get, set, push, child, update, remove, query, orderByChild, equalTo } = require('firebase/database');

const usersRef = ref(database, 'users');

const getAllUsers = async () => {
    try {
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const usersData = snapshot.val();
            return Object.keys(usersData).map(key => ({
                id: key,
                ...usersData[key]
            }));
        }

        return [];
    } catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
};

const getUserById = async (id) => {
    try {
        const userRef = child(usersRef, id);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            return {
                id,
                ...snapshot.val()
            };
        }

        return null;
    } catch (error) {
        console.error(`Error getting user with ID ${id}:`, error);
        throw error;
    }
};

const createUser = async (userData) => {
    try {
        const newUserRef = push(usersRef);
        const id = newUserRef.key;

        const newUser = {
            ...userData,
            createdAt: new Date().toISOString()
        };

        await set(newUserRef, newUser);

        return {
            id,
            ...newUser
        };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

const updateUser = async (id, userData) => {
    try {
        const userRef = child(usersRef, id);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            return null;
        }

        const updates = {
            ...userData,
            updatedAt: new Date().toISOString()
        };

        await update(userRef, updates);

        const updatedSnapshot = await get(userRef);
        return {
            id,
            ...updatedSnapshot.val()
        };
    } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        const userRef = child(usersRef, id);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            return null;
        }

        const userData = snapshot.val();

        await remove(userRef);

        return {
            id,
            ...userData
        };
    } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw error;
    }
};

const searchUsersByZipCode = async (zipCode) => {
    try {
        const zipQuery = query(usersRef, orderByChild('zipCode'), equalTo(zipCode));
        const snapshot = await get(zipQuery);

        if (snapshot.exists()) {
            const matchingUsers = snapshot.val();
            return Object.keys(matchingUsers).map(key => ({
                id: key,
                ...matchingUsers[key]
            }));
        }

        return [];
    } catch (error) {
        console.error(`Error searching users by zip code ${zipCode}:`, error);
        throw error;
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    searchUsersByZipCode
};
