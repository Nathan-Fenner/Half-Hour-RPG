
var enemyName = "";

var enemyStats = {};
enemyStats.goblin = 			{ health: 30	, attack: 3		, defense: 10	, experience: 15	 };
enemyStats["goblin chief"] = 	{ health: 60	, attack: 6		, defense: 20	, experience: 30	 };
enemyStats.troll = 				{ health: 150	, attack: 40	, defense: 10	, experience: 40	 };
enemyStats.dragon = 			{ health: 30000	, attack: 300	, defense: 98	, experience: 10000	 };
enemyStats["ancient dragon"] =	{ health: 30000	, attack: 200	, defense: 99	, experience: 20000	 };

function setupEnemy(name) {
	enemyName = name;
	enemyHealth = stats[enemyName].health;
	enemyStats[enemyName].attack
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

