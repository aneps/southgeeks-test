const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');
const userService = require('../services/userService');

router.post('/', async (req, res) => {
    try {
        const { name, zipCode } = req.body;

        if (!name || !zipCode) {
            return res.status(400).json({
                error: "Name and zip code are required"
            });
        }

        const locationData = await weatherService.fetchLocationData(zipCode);

        const newUser = await userService.createUser({
            name,
            zipCode,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            timezone: locationData.timezone
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            error: "Failed to create user. Please check the zip code and try again."
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({
            error: "Failed to fetch users. Please try again."
        });
    }
});

router.get('/search', async (req, res) => {
    try {
        const { zip } = req.query;

        if (!zip) {
            return res.status(400).json({ error: "Zip code parameter is required" });
        }

        const matchingUsers = await userService.searchUsersByZipCode(zip);
        res.json(matchingUsers);
    } catch (error) {
        console.error(`Error searching users by zip code ${req.query.zip}:`, error);
        res.status(500).json({
            error: "Failed to search users. Please try again."
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(`Error fetching user with ID ${req.params.id}:`, error);
        res.status(500).json({
            error: "Failed to fetch user. Please try again."
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, zipCode } = req.body;
        const currentUser = await userService.getUserById(userId);

        if (!currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const updateData = {};
        if (name) updateData.name = name;

        if (zipCode && zipCode !== currentUser.zipCode) {
            const locationData = await weatherService.fetchLocationData(zipCode);
            updateData.zipCode = zipCode;
            updateData.latitude = locationData.latitude;
            updateData.longitude = locationData.longitude;
            updateData.timezone = locationData.timezone;
        }

        const updatedUser = await userService.updateUser(userId, updateData);
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            error: "Failed to update user. Please check the zip code and try again."
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await userService.deleteUser(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        console.error(`Error deleting user with ID ${req.params.id}:`, error);
        res.status(500).json({
            error: "Failed to delete user. Please try again."
        });
    }
});

module.exports = {
    router
};
