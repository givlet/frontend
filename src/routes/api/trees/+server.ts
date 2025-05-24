import { Server as SocketIO } from 'socket.io';
import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.resolve('./treeData.json');
let treeData: (null | [string, string, string])[];

// Load or initialize the JSON array
try {
	treeData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
} catch {
	treeData = Array(2000).fill(null);
	fs.writeFileSync(DATA_FILE, JSON.stringify(treeData, null, 2));
}

export async function GET() {
	return json(treeData);
}

export async function POST({ request }) {
	const { index, uuid, name, pfp } = await request.json();

	if (treeData[index] === null) {
		treeData[index] = [uuid, name, pfp];
		fs.writeFileSync(DATA_FILE, JSON.stringify(treeData, null, 2));
		return json({ success: true });
	}

	return json({ success: false, error: 'Tree slot already filled' });
}

export function handle({ server }) {
	const io = new SocketIO(server);

	io.on('connection', (socket) => {
		socket.emit('init', treeData);

		socket.on('placeTree', ({ index, uuid, name, pfp }) => {
			if (treeData[index] === null) {
				treeData[index] = [uuid, name, pfp];
				fs.writeFileSync(DATA_FILE, JSON.stringify(treeData, null, 2));
				io.emit('treePlaced', { index, uuid });
			}
		});
	});
}
