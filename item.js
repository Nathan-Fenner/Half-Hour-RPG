"use strict";


/*
Interface:

acquireItem(name)
dropItem(name, ?amount )
hasItem(name, ?amount)
acquireGold(amount)
hasGold(amount)
equipWeapon(weapon)
equipArmor(armor)
unequipWeapon()
unequipArmor()

renderInventory()

*/

/*
REQUIRED:
.name
.type
.describe() -- give short description


.useSelf() -- use on self
.useSelfPeaceful() -- use on self only in peace
.useSelfCombat() -- use on self only in combat
.useEnemy() -- use on enemy (requires combat)
.longDescribe() -- optional long description

For particular types:

"weapon"
required:
	.attack
optional:
	.beforeAttack(target)
	.afterAttack(target)
	.parry(target)

"armor"
required:
	.defense
optional:
	.beforeBlock(target)
	.afterBlock(target)

"consumable"
required:
	.consume(self)



*/


function weaponDescribe(weapon) {
	return nameCase(weapon.name) + " (+" + weapon.attack + ")";
}

function armorDescribe(armor) {
	return nameCase(armor.name) + " [+" + armor.defense + "]";
}

var itemDataTable = {};
itemDataTable.weapon = {type:"weapon", describeFun: weaponDescribe};
itemDataTable.armor = {type:"armor", describeFun: armorDescribe};

itemDataTable["fists"] = {parent:"weapon", attack:2};
itemDataTable["copper dagger"] = {parent:"weapon", attack: 10};
itemDataTable["steel sword"] = {parent:"weapon", attack: 10};
itemDataTable["war axe"] = {parent:"weapon", attack: 30};
itemDataTable["spear"] = {parent:"weapon", attack: 20};
itemDataTable["spectral sword of despair"] = {parent:"weapon", attack: 80};

itemDataTable["cloth"] = {parent:"armor", defense: 5};
itemDataTable["leather armor"] = {parent:"armor", defense: 10};
itemDataTable["iron platemail"] = {parent:"armor", defense: 20};
itemDataTable["chainmail"] = {parent:"armor", defense: 50};
itemDataTable["mithril platemail"] = {parent:"armor", defense: 75};
itemDataTable["mithril chainmail"] = {parent:"armor", defense: 80};



function Item(name) {
	if (!itemDataTable[name]) {
		throw "no such item " + name;
	}
	this.name = name;
	var data = itemDataTable[name];
	do {
		for (var i in data) {
			if (i !== "parent") {
				this[i] = data[i];
			}
		}
		data = data.parent && itemDataTable[data.parent];
	} while (data);
}
Item.prototype.describe = function() {
	return this.describeFun(this);
};



var playerItems = [];
var playerGold = 0;
var playerWeapon = new Item("fists");
var playerArmor = new Item("cloth");

function acquireItem(item) {
	if (!(item instanceof Item)) {
		throw "not an item";
	}
	playerItems.push(item);
	renderInventory();
}

function dropItem(name, amount) {

	if (name instanceof Item) {
		for (var i = 0; i < playerItems.length; ++i) {
			if (playerItems[i] === name) {
				playerItems.splice(i, 1);
				renderInventory();
				return;
			}
		}
		throw "no such item in inventory";
	}


	if (typeof name !== "string" || !stats[name]) {
		throw "no such item " + name;
	}
	if (typeof amount === "undefined") {
		for (var i = 0; i < playerItems.length; ++i) {
			if (playerItems[i].name === name) {
				playerItems.splice(i, 1);
				renderInventory();
				return;
			}
		}
		throw "player doesn't have item " + name;
	}
	if (typeof amount !== "number") {
		throw "amount is not a number";
	}
	if (amount < 0 || Math.floor(amount) != amount) {
		throw "amount is not a non-negative integer";
	}
	for (var i = 0; i < amount; ++i) {
		dropItem(name);
	}
	renderInventory();
}

function countItem(name) {
	if (typeof name !== "string" || !stats[name]) {
		throw "no such item " + name;
	}
	var count = 0;
	for (var i = 0; i < playerItems.length; ++i) {
		if (playerItems[i].name === name) {
			++count;
		}
	}
	renderInventory();
	return count;
}
function hasItem(name, amount) {
	if (amount === undefined) {
		amount = 1;
	}
	renderInventory();
	return countItem(name) >= amount;
}

function acquireGold(amount) {
	if (typeof amount !== "number") {
		throw "amount is not number " + amount;
	}
	if (!isFinite(amount)) {
		throw "amount is not finite " + amount;
	}
	playerGold += amount;
	renderInventory();
}

function hasGold(amount) {
	if (typeof amount !== "undefined") {
		throw "amount is not number " + amount;
	}
	if (!isFinite(amount)) {
		throw "amount is not finite " + amount;
	}
	renderInventory();
	return playerGold >= amount;
}

function equipWeapon(item) {
	dropItem(item);
	if (playerWeapon.name !== "fists") {
		acquireItem(playerWeapon);
	}
	playerWeapon = item;
	renderInventory();
}

function equipArmor(item) {
	dropItem(item);
	if (playerArmor.name !== "cloth") {
		acquireItem(playerArmor);
	}
	playerArmor = item;
	renderInventory();
}

function unequipWeapon() {
	if (playerWeapon.name !== "fists") {
		acquireItem(playerWeapon);
	}
	playerWeapon = new Item("fists");
	renderInventory();
}

function unequipArmor() {
	if (playerArmor.name !== "cloth") {
		acquireItem(playerArmor);
	}
	playerArmor = new Item("cloth");
	renderInventory();
}



function useItem(item) {

	if (!(item instanceof Item)) {
		throw "not a valid item";
	}

	var doesSomething = true;

	if (item.type === "weapon") {
		equipWeapon(item);
	} else if (item.type === "armor") {
		equipArmor(item);
	} else if (item.type === "consumable") {
		item.use();
	} else if (item.type === "splash" && playerMode === "combat") {
		item.use();
	} else {
		doesSomething = false;
	}

	if (doesSomething && playerMode === "combat") {
		combatAdvanceTurn();
	}
	// otherwise do nothing
	renderInventory();
}

function useItemClosure(item) {
	return function() {
		useItem(item);
	}
	renderInventory();
}

function nameCase(s) {
	return s.charAt(0).toUpperCase() + s.substring(1);
}


function renderInventory() {
	var list = document.createElement("ul");

	var weapon = document.createElement("li");
	weapon.innerHTML = "[Weapon] " + playerWeapon.describe();
	list.appendChild(weapon);

	var armor = document.createElement("li");
	armor.innerHTML = "[Armor] " + playerArmor.describe();
	list.appendChild(armor);

	for (var i = 0; i < playerItems.length; ++i) {
		var item = playerItems[i];
		var li = document.createElement("li");
		li.innerHTML = item.describe() + " ";
		var button = document.createElement("button");
		button.innerHTML = "Use";
		button.onmousedown = useItemClosure(item);
		li.appendChild(button);
		list.appendChild(li);
	}
	var gold = document.createElement("li");
	gold.innerHTML = playerGold + " Gold";
	list.appendChild(gold);
	document.getElementById("inventory").innerHTML = "";
	document.getElementById("inventory").appendChild(list);

}



renderInventory();