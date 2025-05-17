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

const list_2023_final =
`Sweden
Finland
Israel
Italy
Norway
Ukraine
Belgium
Estonia
Australia
Czechia
Lithuania
Cyprus
Croatia
Armenia
Austria
France
Spain
Moldova
Poland
Switzerland
Slovenia
Albania
Portugal
Serbia
United Kingdom
Germany`;

const list_2024_final =
`Sweden "Unforgettable"
Ukraine "Teresa & Maria"
Germany "Always on the Run"
Luxembourg "Fighter"
Netherlands "Europapa"
Israel "Hurricane"
Lithuania "Luktelk"
Spain "Zorra"
Estonia "(Nendest) narko..."
Ireland "Doomsday Blue"
Latvia "Hollow"
Greece "Zari"
United Kingdom "Dizzy"
Norway "Ulveham"
Italy "La noia"
Serbia "Ramonda"
Finland "No Rules!"
Portugal "Grito"
Armenia "Jako"
Cyprus "Liar"
Switzerland "The Code"
Slovenia "Veronika"
Croatia "Rim Tim Tagi Dim"
Georgia "Firefighter"
France "Mon amour"
Austria "We Will Rave"`;

const list_2025_final =
`
Norway "Lighter"
Luxembourg "La poupée monte le son"
Estonia "Espresso Macchiato"
Israel "New Day Will Rise"
Lithuania "Tavo akys"
Spain "Esa diva"
Ukraine "Bird of Pray"
United Kingdom "What the Hell Just Happened?"
Austria "Wasted Love"
Iceland "Róa"
Latvia "Bur man laimi"
Netherlands "C'est la vie"
Finland "Ich komme"
Italy "Volevo essere un duro"
Poland "Gaja"
Germany "Baller"
Greece "Asteromata"
Armenia "Survivor"
Switzerland "Voyage"
Malta "Serving"
Portugal "Deslocado"
Denmark "Hallucination"
Sweden "Bara bada bastu"
France "Maman"
San Marino "Tutta l'Italia"
Albania "Zjerm"`;

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

	document.getElementById("2023-final").onclick = () => presetList(list_2023_final);
	document.getElementById("2024-final").onclick = () => presetList(list_2024_final);
	document.getElementById("2025-final").onclick = () => presetList(list_2025_final);
}

setup();
