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

function levelup() {
	playerLevel++;
	reportText("You went up a level! You are now <b>level " + playerLevel + "</b>.");
}

function gainExperience(exp) {
	playerExperience += exp;
	while (playerExperience >= playerExperienceNeeded()) {
		playerExperience -= playerExperienceNeeded();
		levelup();
	}
	renderStats();
}

function playerTakeDamage(amount) {
	var armor = playerArmor.defense;
	amount = Math.ceil( amount * (1 - armor / 100) );
	playerHealth -= amount;
	playerHealth = Math.max(0, playerHealth);
	renderStats();
}

function playerHeal(amount) {
	playerHealth += amount;
	playerHealth = Math.min(playerHealth, playerMaxHealth);
	renderStats();
}

function playerMaxHeal() {
	playerHealth = playerMaxHealth;
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
	health.innerHTML = "Health: " + playerHealth + " / " + playerMaxHealth;
	var level = document.createElement("li");
	level.innerHTML = "Level: " + playerLevel;
	var experience = document.createElement("li");
	experience.innerHTML = "Experience: " + playerExperience + " / " + playerExperienceNeeded();
	stats.appendChild(health);
	stats.appendChild(level);
	stats.appendChild(experience);
	document.getElementById("stats").innerHTML = "";
	document.getElementById("stats").appendChild(stats);
}
renderStats();