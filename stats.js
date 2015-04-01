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

renderStats(into)

*/

var playerHealth = 100;
var playerMaxHealth = 100;
var playerLevel = 1;
var playerExperience = 0;

function playerLiving() {
	return playerHealth > 0;
}

function playerExperienceNeeded() {
	return Math.floor(Math.pow(10, 0.75 + playerLevel / 4) );
}

function gainExperience(exp) {
	playerExperience += exp;
	while (playerExperience >= playerExperienceNeeded()) {
		playerExperience -= playerExperienceNeeded();
		++playerLevel;
	}
}

function playerTakeDamage(amount) {
	var armor = stats[playerArmor].defense;
	amount = Math.ceil( amount * (1 - armor / 100) );
	playerHealth -= amount;
	playerHealth = Math.max(0, playerHealth);
}

function playerHeal(amount) {
	playerHealth += amount;
	playerHealth = Math.min(playerHealth, playerMaxHealth);
}

function playerMaxHeal() {
	playerHealth = playerMaxHealth;
}

function getPlayerAttack() {
	var attack = stats[playerWeapon].attack;
	var amount = Math.ceil( attack * (1 + Math.random()) / 2);
	return amount;
}


function renderStats(into) {
	var stats = document.createElement("ul");
	var health = document.createElement("li");
	health.innerHTML = "Health: " + playerHealth + " / " + playerMaxHealth;
	var level = document.createElement("li");
	level.innerHTML = "Level: " + playerLevel;
	var experience = document.createElement("li");
	experience.innerHTML = "Experience: " + playerExperience + " / " + playerExperienceNeeded();
	stats.appendChild(health);
	stats.appendChild(level);
	stats.appendChild(experience);
	into.appendChild(stats);
}
