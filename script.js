var source = document.getElementById("main-list-text");
var mainList = document.getElementById("main-list");

function handleSource(ev)
{
	var values = source.value.split('\n');
	source.parentNode.style.display = "none";

	mainList.replaceChildren();
	values.forEach(v =>
	{
		if (v == "") return;

		var elem = document.createElement("div");
		elem.classList.add("list-group-item", "py-1");
		elem.innerHTML = v;

		mainList.appendChild(elem);
	});

	var topN = document.getElementById("topN");
	topN.max = mainList.childNodes.length;
	topN.value = Math.min(topN.value, topN.max);

	mainList.style.display = "";

	var buttondiv = document.getElementById("edit-button");
	buttondiv.style.display = "";

	cloneItems();

	Sortable.create(mainList, {
		animation: 150,
		onSort: updateAllLists
	});
}

function cloneItems()
{
	for (list of document.getElementsByClassName("player-list"))
	{
		var newNode = mainList.cloneNode(true)
		newNode.classList.add("player-list");
		newNode.id = "";

		list.replaceWith(newNode);

		Sortable.create(newNode, {
			animation: 150,
			onSort: ev => updateList(ev.item.parentNode)
		});
	}

	updateAllLists();
}

var ordering = {};

function updateAllLists()
{
	ordering = {};

	var count = 0;
	for (c of mainList.children)
	{
		var text = c.innerText;
		ordering[text] = count;
		count++;
	}

	for(list of document.getElementsByClassName("player-list"))
	{
		updateList(list);
	}
}

function updateList(list)
{
	var topN = document.getElementById("topN").value;

	var top = [... list.children];
	var bottom = top.splice(topN);

	top.forEach(c => c.classList.remove("list-group-item-dark"));
	bottom.forEach(c => c.classList.add("list-group-item-dark"));

	bottom.sort((a,b) => ordering[a.innerText] - ordering[b.innerText]);
	top.concat(bottom).forEach(c => list.appendChild(c));

	computeScore(list, topN);
}

function computeScore(list, topN)
{
	var items = [... list.children].map(x => x.innerText);
	var N = items.length;
	var bottom = N - topN;

	var count = 0;

	for(var i = 0 ; i < N ; i++)
	{
		for(var j = i + 1 ; j < N ; j++)
		{
			if (ordering[items[i]] < ordering[items[j]])
				count++;
		}
	}

	var maxScore = N * (N-1) / 2;
	var minScore = bottom * (bottom - 1) / 2;
	var score = count - minScore;
	var perc = score / (maxScore - minScore) * 100;

	var scoreDiv = list.parentNode.querySelector(".score");
	scoreDiv.innerText = `${score} (${perc.toFixed(1)}%)`;
}

function handleEdit(ev)
{
	var values = [];
	for (c of mainList.children)
	{
		values.push(c.innerHTML);
	}
	mainList.replaceChildren();
	mainList.style.display = "none";

	source.value = values.join("\n");
	source.parentNode.style.display = "";

	var buttondiv = document.getElementById("edit-button");
	buttondiv.style.display = "none";
}

const list_2023_semi_1 =
`Croatia
Ireland
Latvia
Malta
Norway
Portugal
Serbia
Azerbaijan
Czech Republic
Finland
Israel
Moldova
Netherlands
Sweden
Switzerland`;

const list_2023_semi_2 =
`Armenia
Belgium
Cyprus
Denmark
Estonia
Greece
Iceland
Romania
Albania
Australia
Austria
Georgia
Lithuania
Poland
San Marino
Slovenia`;

function presetList(src)
{
	source.value = src;
	handleSource();
}

function setup()
{
	source.onchange = handleSource;
	source.onblur = handleSource;

	document.getElementById("edit-button").onclick = handleEdit;
	document.getElementById("topN").onchange = updateAllLists;

	document.getElementById("2023-semi-1").onclick = () => presetList(list_2023_semi_1);
	document.getElementById("2023-semi-2").onclick = () => presetList(list_2023_semi_2);
}

setup();
