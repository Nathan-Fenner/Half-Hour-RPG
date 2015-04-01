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

var playerItems = [];
var playerGold = 0;
var playerWeapon = null;
var playerArmor = null;

var descriptions = {};
descriptions.sword = "A steel sword"

var stats = {};
stats.fists = {type:"weapon",attack:2};
stats.dagger = {type:"weapon",attack:10};
stats.sword = {type:"weapon",attack:15};
stats.warhammer = {type:"weapon",attack:25};
stats["sword of flames"] = {type:"weapon",attack:35};

stats["cloth"] = {type:"armor", defense:2};
stats["leather armor"] = {type:"armor", defense:20};
stats["iron platemail"] = {type:"armor", defense:40};
stats["mithril chainmail"] = {type:"armor", defense:85};
stats["ringmail of light"] = {type:"armor", defense:90};


function acquireItem(name) {
	if (typeof(name) !== "string" || !stats[name]) {
		throw "no such item " + name;
	}
	playerItems.push(name);
	renderInventory();
}

function dropItem(name, amount) {
	if (typeof name !== "string" || !stats[name]) {
		throw "no such item " + name;
	}
	if (typeof amount === "undefined") {
		for (var i = 0; i < playerItems.length; ++i) {
			if (playerItems[i] === name) {
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
		if (playerItems[i] === name) {
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
	if (typeof amount !== "undefined") {
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

function equipWeapon(name) {
	if (!stats[name] || stats[name].type !== "weapon") {
		throw "not a weapon " + name;
	}
	dropItem(name);
	if (equipWeapon !== "fists") {
		acquireItem(equipWeapon);
	}
	equipWeapon = name;
	renderInventory();
}

function equipArmor(name) {
	if (!stats[name] || stats[name].type !== "armor") {
		throw "not an armor " + name;
	}
	dropItem(name);
	if (equipArmor !== "cloth") {
		acquireItem(equipArmor);
	}
	equipArmor = name;
	renderInventory();
}

function unequipWeapon(name) {
	if (equipWeapon !== "fists") {
		acquireItem(equipWeapon);
	}
	equipWeapon = "fists";
	renderInventory();
}

function unequipArmor(name) {
	if (equipArmor !== "cloth") {
		acquireItem(equipArmor);
	}
	equipArmor = "cloth";
	renderInventory();
}



function useItem(item) {

	if (!stats[item]) {
		throw "not a valid item " + item;
	}
	var doesSomething = true;
	var stat = stats[item];
	if (stat.type === "weapon") {
		equipWeapon(item);
	} else if (stat.type === "armor") {
		equipArmor(item);
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
	for (var i = 0; i < playerItems.length; ++i) {
		var item = playerItems[i];
		var li = document.createElement("li");
		li.innerHTML = nameCase(item) + " ";
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



