import { v4 as uuidv4 } from 'uuid';

const firstNames = [
	'Mighty',
	'Swift',
	'Brave',
	'Clever',
	'Gentle',
	'Happy',
	'Wise',
	'Bold',
	'Cheerful',
	'Playful'
];
const lastNames = [
	'Panda',
	'Falcon',
	'Tiger',
	'Fox',
	'Dolphin',
	'Koala',
	'Owl',
	'Lion',
	'Penguin',
	'Otter'
];

export function generateRandomUser() {
	const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
	const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
	const randomName = `${randomFirstName} ${randomLastName}`;
	const randomProfilePicture = `https://api.dicebear.com/6.x/identicon/svg?seed=${uuidv4()}`;
	const id = uuidv4();
	const streak = 0; // Initial streak is 0
	const inventory = {}; // Initialize empty inventory

	return { name: randomName, profilePicture: randomProfilePicture, streak, inventory, id };
}

export function getUserFromCookie() {
	const userCookie = document.cookie.split('; ').find((row) => row.startsWith('user='));

	if (userCookie) {
		return JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
	}

	return null;
}

export function saveUserToCookie(user) {
	document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=31536000`;
}

export function addToInventory(user, componentName, quantity) {
	user.inventory[componentName] = (user.inventory[componentName] || 0) + quantity;
	saveUserToCookie(user);
}

export function removeFromInventory(user, componentName, quantity) {
	if (user.inventory[componentName]) {
		user.inventory[componentName] = Math.max(0, user.inventory[componentName] - quantity);
		saveUserToCookie(user);
	}
}

export function getInventory(user) {
	return user.inventory;
}
