const uuidv4 = require('uuid/v4');
const utils = require('../utils');

async function banUsers() {
	const client = utils.getTestClient(true);
	const user = {
		id: uuidv4(),
	};

	const evilUser = 'evil-user' + uuidv4();
	await utils.createUsers([evilUser, user.id]);
	return await client.banUser(evilUser, {
		user_id: user.id,
	});
}

async function unbanUsers() {
	const client = utils.getTestClient(true);
	const user = {
		id: uuidv4(),
	};

	const evilUser = 'evil-user' + uuidv4();
	await utils.createUsers([evilUser, user.id]);

	return await client.unbanUser(evilUser);
}

async function muteUser() {
	const user1 = uuidv4();
	const user2 = uuidv4();
	await utils.createUsers([user1, user2]);
	const client1 = await utils.getTestClientForUser(user1);

	return await client1.muteUser(user2);
}

async function unmuteUser() {
	const user1 = uuidv4();
	const user2 = uuidv4();
	await utils.createUsers([user1, user2]);
	const client1 = await utils.getTestClientForUser(user1);

	await client1.muteUser(user2);
	return await client1.unmuteUser(user2);
}
async function flagUser() {
	//flag the user
	const authClient = utils.getTestClient(true);
	const serverAuthClient = utils.getTestClient(true);
	const thierry = {
		id: 'thierry2',
		name: 'Thierry',
		status: 'busy',
		image: 'myimageurl',
		role: 'admin',
	};

	const tommaso = {
		id: 'tommaso',
		name: 'Tommaso',
		image: 'myimageurl',
		role: 'admin',
	};

	await serverAuthClient.updateUsers([thierry, tommaso, { id: 'thierry' }]);
	//	delete thierry.role;
	// await isn't needed but makes testing a bit easier
	await authClient.setUser(thierry);
	const evilId = uuidv4();
	const evil = {
		id: evilId,
		name: 'Eviluser',
		status: 'busy',
		image: 'myimageurl',
		role: 'user',
	};

	const modUserID = uuidv4();

	await utils.createUsers([modUserID]);
	await serverAuthClient.updateUser(evil);

	return await authClient.flagUser(evilId);
}

async function unflagUser() {
	//flag the user
	const authClient = utils.getTestClient(true);
	const serverAuthClient = utils.getTestClient(true);
	const evilId = uuidv4();
	const evil = {
		id: evilId,
		name: 'Eviluser',
		status: 'busy',
		image: 'myimageurl',
		role: 'user',
	};
	const thierry = {
		id: 'thierry2',
		name: 'Thierry',
		status: 'busy',
		image: 'myimageurl',
		role: 'admin',
	};

	const tommaso = {
		id: 'tommaso',
		name: 'Tommaso',
		image: 'myimageurl',
		role: 'admin',
	};

	await serverAuthClient.updateUsers([thierry, tommaso, { id: 'thierry' }]);
	//	delete thierry.role;
	// await isn't needed but makes testing a bit easier
	await authClient.setUser(thierry);
	const modUserID = uuidv4();

	await utils.createUsers([modUserID]);
	await serverAuthClient.updateUser(evil);

	await authClient.flagUser(evilId);

	return await authClient.unflagUser(evilId);
}

async function flagMessage() {
	//flag the user
	const authClient = utils.getTestClient(true);
	const serverAuthClient = utils.getTestClient(true);
	const thierry = {
		id: 'thierry2',
		name: 'Thierry',
		status: 'busy',
		image: 'myimageurl',
		role: 'admin',
	};

	const tommaso = {
		id: 'tommaso',
		name: 'Tommaso',
		image: 'myimageurl',
		role: 'admin',
	};

	await serverAuthClient.updateUsers([thierry, tommaso, { id: 'thierry' }]);
	//	delete thierry.role;
	// await isn't needed but makes testing a bit easier
	await authClient.setUser(thierry);

	const channel = authClient.channel('livestream', `ninja-${uuidv4()}`, {
		mysearchablefield: 'hi',
	});

	await channel.watch();

	const text = 'Flag me, i dare you mods!';
	const messageResponse = await channel.sendMessage({ text });
	return await authClient.flagMessage(messageResponse.message.id);
}

async function unflagMessage() {
	//flag the user
	const authClient = utils.getTestClient(true);
	const serverAuthClient = utils.getTestClient(true);
	const thierry = {
		id: 'thierry2',
		name: 'Thierry',
		status: 'busy',
		image: 'myimageurl',
		role: 'admin',
	};

	const tommaso = {
		id: 'tommaso',
		name: 'Tommaso',
		image: 'myimageurl',
		role: 'admin',
	};

	await serverAuthClient.updateUsers([thierry, tommaso, { id: 'thierry' }]);
	//	delete thierry.role;
	// await isn't needed but makes testing a bit easier
	await authClient.setUser(thierry);

	const channel = authClient.channel('livestream', `ninja-${uuidv4()}`, {
		mysearchablefield: 'hi',
	});

	await channel.watch();

	const text = 'Flag me, i dare you mods!';
	const messageResponse = await channel.sendMessage({ text });
	await authClient.flagMessage(messageResponse.message.id);

	return await authClient.unflagMessage(messageResponse.message.id);
}

async function createPermission() {
	const authClient = await utils.getTestClient(true);
	return await authClient.createPermission({
		name: 'TestCreatePermission',
		resource: 'ReadChannel',
	});
}

async function getPermission() {
	const authClient = await utils.getTestClient(true);
	await authClient.createPermission({
		name: 'TestGetPermission',
		resource: 'ReadChannel',
	});
	return await authClient.getPermission('TestGetPermission');
}

async function updatePermission() {
	const authClient = await utils.getTestClient(true);
	await authClient.createPermission({
		name: 'TestUpdatePermission',
		resource: 'ReadChannel',
	});
	return await authClient.updatePermission('TestUpdatePermission', {
		resource: 'DeleteChannel',
	});
}

async function deletePermission() {
	const authClient = await utils.getTestClient(true);
	await authClient.createPermission({
		name: 'TestDeletePermission',
		resource: 'DeleteChannel',
	});
	return await authClient.deletePermission('TestDeletePermission');
}

async function listPermissions() {
	const authClient = await utils.getTestClient(true);
	await authClient.createPermission({
		name: 'TestListPermissions',
		resource: 'ReadChannel',
	});
	return await authClient.listPermissions();
}

async function createRole() {
	const authClient = await utils.getTestClient(true);
	return await authClient.createRole(uuidv4());
}

async function listRoles() {
	const authClient = await utils.getTestClient(true);
	await authClient.createRole('TestListRole');
	authClient.listRoles();
}

async function deleteRole() {
	const name = uuidv4();
	const authClient = await utils.getTestClient(true);
	await authClient.createRole(name);
	return await authClient.deleteRole(name);
}

module.exports = {
	banUsers,
	createPermission,
	createRole,
	deletePermission,
	deleteRole,
	getPermission,
	unbanUsers,
	listPermissions,
	listRoles,
	muteUser,
	unmuteUser,
	flagUser,
	unflagUser,
	flagMessage,
	unflagMessage,
	updatePermission,
};
