
var enemyName = "";

var enemyStats = {};
enemyStats.goblin = 			{ health: 30	, attack: 3		, defense: 10	, experience: 15	 };
enemyStats["goblin chief"] = 	{ health: 60	, attack: 6		, defense: 20	, experience: 30	 };
enemyStats.troll = 				{ health: 150	, attack: 40	, defense: 10	, experience: 40	 };
enemyStats.dragon = 			{ health: 30000	, attack: 300	, defense: 98	, experience: 10000	 };
enemyStats["ancient dragon"] =	{ health: 30000	, attack: 200	, defense: 99	, experience: 20000	 };

function enterCombat(name) {
	enemyName = name;
	enemyHealth = stats[enemyName].health;
	enemyStats[enemyName].attack;
	document.getElementById("site").style.display = "none";
	document.getElementById("map").style.display = "none";
	document.getElementById("combat").style.display = "combat";
	combatRender();
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
	document.getElementById("combat_enemy_health").innerHTML = "Enemy Health: " + enemyHealth + "/" + enemyMaxHeal;
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
		return leaveCombat();
	}
	enemyTurn();
	if (!playerLiving()) {
		alert("You died!");
	}
	if (!enemyLiving()) {
		combatRender();
		return leaveCombat();
	}
	combatRender();
}


// Returns the UI that was hidden when the encounter started
function leaveCombat() {
	document.getElementById("site").style.display = "block";
	document.getElementById("map").style.display = "block";
	document.getElementById("combat").style.display = "none";
	playerMode = "explore";
}

document.getElementById("combat_button_attack").onmousedown = function() {
	enemyTakeDamage( getPlayerAttack() );
	combatAdvance();
};

document.getElementById("combat_button_flee").onmousedown = function() {
	if (Math.random() < 0.25) {
		alert("You got away!");
		return leaveCombat();
	} else {
		alert("Your enemy prevents your retreat!");
		combatAdvance();
	}
};

document.getElementById("combat_button_wait").onmousedown = function() {
	combatAdvance();
};

