"use strict";


var newsList = [];

function addNews(news) {
	news = news.trim().replace(/\n+/g,"\n");
	news = news.split("\n");
	for (var i = 0; i < news.length; i++) {
		newsList.push(news[i]);
	}
	renderNews();
}

function renderNews() {
	var news = document.getElementById("news");
	news.innerHTML = "";
	var ul = document.createElement("ul");
	for (var i = 0; i < newsList.length; ++i) {
		var li = document.createElement("li");
		li.innerHTML = newsList[i];
		ul.appendChild(li);
	}
	news.appendChild(ul);
	news.scrollTop = news.scrollHeight;
}
