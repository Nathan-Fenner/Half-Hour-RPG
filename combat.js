"use strict";

var enemyName = "";

var enemyStats = {};
enemyStats.goblin = 			{ health: 30	, attack: 3		, defense: 10	, experience: 15	, loot: ["dagger","leather armor","sword"]	 };
enemyStats["goblin chief"] = 	{ health: 60	, attack: 6		, defense: 20	, experience: 30	, loot: ["sword","iron platemail","mithril chainmail"] };
enemyStats.troll = 				{ health: 150	, attack: 40	, defense: 10	, experience: 40	, loot: ["sword", "iron platemail","warhammer"] };
enemyStats.dragon = 			{ health: 30000	, attack: 300	, defense: 98	, experience: 10000	, loot: ["sword of flames", "mithril chainmail","warhammer"] };
enemyStats["ancient dragon"] =	{ health: 30000	, attack: 200	, defense: 99	, experience: 20000	, loot: ["ringmail of light", "mithril chainmail","warhammer"] };

function enterCombat(name) {
	enemyName = name;
	enemyHealth = enemyStats[enemyName].health;
	enemyStats[enemyName].attack;
	document.getElementById("site").style.display = "none";
	document.getElementById("map").style.display = "none";
	document.getElementById("combat").style.display = "block";
	combatRender();
	playerMode = "combat";
}


var enemyHealth = 0;

function enemyLiving() {
	return enemyHealth > 0;
}

function enemyTakeDamage(amount) {
	amount = Math.ceil( amount * (1 - enemyStats[enemyName].defense / 100) );
	enemyHealth -= amount;
	enemyHealth = Math.max(0, enemyHealth);
}

function enemyHeal(amount) {
	enemyHealth += amount;
	enemyHealth = Math.min(enemyHealth, enemyStats[enemyName].health);
}

function enemyMaxHeal() {
	enemyHealth = enemyStats[enemyName].health;
}

function getEnemyAttack() {
	var amount = Math.ceil( enemyStats[enemyName].attack * (1 + Math.random()) / 2);
	return amount;
}

function combatRender() {
	document.getElementById("combat_enemy_name").innerHTML = nameCase(enemyName);
	document.getElementById("combat_enemy_health").innerHTML = "Enemy Health: " + enemyHealth + "/" + enemyStats[enemyName].health;
	document.getElementById("combat_enemy_attack").innerHTML = "Enemy Attack: " + enemyStats[enemyName].attack;
	document.getElementById("combat_enemy_defense").innerHTML = "Enemy Defense: " + enemyStats[enemyName].defense;
}

function enemyTurn() {
	playerTakeDamage( getEnemyAttack() );
}

function combatAdvance() {
	if (!playerLiving()) {
		alert("You died!");
	}
	if (!enemyLiving()) {
		combatRender();
		return winCombat();
	}
	enemyTurn();
	if (!playerLiving()) {
		alert("You died!");
	}
	if (!enemyLiving()) {
		combatRender();
		return winCombat();
	}
	combatRender();
}


// Returns the UI that was hidden when the encounter started
function leaveCombat() {
	document.getElementById("site").style.display = "block";
	document.getElementById("map").style.display = "block";
	document.getElementById("combat").style.display = "none";
	document.getElementById("encounter").style.display = "none";
	playerMode = "explore";
}

function winCombat() {
	var xp = enemyStats[enemyName].experience;
	
	var item = null;
	if (Math.random() < 0.5 && enemyStats[enemyName].loot && enemyStats[enemyName].loot.length > 0) {
		// win an item
		item = enemyStats[enemyName].loot[Math.floor(Math.random()*enemyStats[enemyName].loot.length)];
		
	}
	var gold = 0;
	if (Math.random() < 0.75) {
		gold = Math.floor(Math.max(Math.sqrt(enemyStats[enemyName].experience) * 10 + Math.random() * 100 - 50,0) + 10);
	}
	var summary = "<h4>You defeated the " + enemyName + "!</h4>\n+"
	summary += xp + " XP<br>\n";
	if (item) {
		summary += "You found a <b>" + describe(item) + "</b>!<br>\n";
	}
	if (gold) {
		summary += "You got <b>" + gold + " gold</b>!";
	}
	reportText(summary);
	gainExperience( xp );
	if (item) {
		acquireItem( item );
	}
	acquireGold( gold );

	currentSite.explore();
}

document.getElementById("combat_button_attack").onclick = function() {
	enemyTakeDamage( getPlayerAttack() );
	combatAdvance();
};

document.getElementById("combat_button_flee").onclick = function() {
	if (Math.random() < 0.25) {
		alert("You got away!");
		return leaveCombat();
	} else {
		alert("Your enemy prevents your retreat!");
		combatAdvance();
	}
};

document.getElementById("combat_button_wait").onclick = function() {
	combatAdvance();
};

