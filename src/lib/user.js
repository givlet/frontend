import { v4 as uuidv4 } from 'uuid';

const names = [
  'Mighty Panda',
  'Swift Falcon',
  'Brave Tiger',
  'Clever Fox',
  'Gentle Dolphin',
  'Happy Koala',
  'Wise Owl',
  'Bold Lion',
  'Cheerful Penguin',
  'Playful Otter'
];

export function generateRandomUser() {
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomProfilePicture = `https://api.dicebear.com/6.x/identicon/svg?seed=${uuidv4()}`;
  const streak = 0; // Initial streak is 0

  return { name: randomName, profilePicture: randomProfilePicture, streak };
}

export function getUserFromCookie() {
  const userCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('user='));

  if (userCookie) {
    return JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
  }

  return null;
}

export function saveUserToCookie(user) {
  document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=31536000`; // 1 year
}
