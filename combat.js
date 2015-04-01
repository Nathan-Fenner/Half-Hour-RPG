
var enemyHealth = 0;
var enemyMaxHealth = 0;

var enemyAttack = 0;
var enemyArmor = 0;

function enemyLiving() {
	return enemyHealth > 0;
}

function enemyTakeDamage(amount) {
	amount = Math.ceil( amount * (1 - enemyArmor / 100) );
	enemyHealth -= amount;
	enemyHealth = Math.max(0, enemyHealth);
}

function enemyHeal(amount) {
	enemyHealth += amount;
	enemyHealth = Math.min(enemyHealth, enemyMaxHealth);
}

function enemyMaxHeal() {
	enemyHealth = enemyMaxHealth;
}

function getEnemyAttack() {
	var amount = Math.ceil( enemyAttack * (1 + Math.random()) / 2);
	return amount;
}

