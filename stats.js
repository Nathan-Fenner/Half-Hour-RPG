"use strict";

/*
Interface:

playerLiving()
experienceNeeded()
gainExperience(exp)

playerTakeDamage(dmg)

playerHeal(amt)
playerMaxHeal()

playerGetAttack()

renderStats()

*/

var player = {health:100, maxHealth:100, level: 1, experience:0};


function playerLiving() {
	return player.health > 0;
}

function playerExperienceNeeded() {
	return Math.floor(Math.pow(10, 0.75 + player.level / 4) );
}

function levelup() {
	player.level++;
	reportText("You went up a level! You are now <b>level " + player.level + "</b>.");
}

function gainExperience(exp) {
	player.experience += exp;
	while (player.experience >= playerExperienceNeeded()) {
		player.experience -= playerExperienceNeeded();
		levelup();
	}
	renderStats();
}

function playerTakeDamage(amount) {
	var armor = playerArmor.defense;
	amount = Math.ceil( amount * (1 - armor / 100) );
	player.health -= amount;
	player.health = Math.max(0, player.health);
	renderStats();
}

function playerHeal(amount) {
	player.health += amount;
	player.health = Math.min(player.health, player.maxHealth);
	renderStats();
}

function playerMaxHeal() {
	player.health = player.maxHealth;
	renderStats();
}

function getPlayerAttack() {
	var attack = playerWeapon.attack;
	var amount = Math.ceil( attack * (1 + Math.random()) / 2);
	return amount;
}


function renderStats() {
	var stats = document.createElement("ul");
	var health = document.createElement("li");
	health.innerHTML = "Health: " + player.health + " / " + player.maxHealth;
	var level = document.createElement("li");
	level.innerHTML = "Level: " + player.level;
	var experience = document.createElement("li");
	experience.innerHTML = "Experience: " + player.experience + " / " + playerExperienceNeeded();
	stats.appendChild(health);
	stats.appendChild(level);
	stats.appendChild(experience);
	document.getElementById("stats").innerHTML = "";
	document.getElementById("stats").appendChild(stats);
}
renderStats();