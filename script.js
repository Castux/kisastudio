var mainList = document.getElementById("main-list");

function handleSource(ev)
{
	var values = ev.target.value.split('\n');
	ev.target.parentNode.style.display = "none";

	values.forEach(v =>
	{
		if (v == "") return;

		var elem = document.createElement("div");
		elem.classList.add("list-group-item", "py-1");
		elem.innerHTML = v;

		mainList.appendChild(elem);
	});

	mainList.style.display = "";

	var buttondiv = document.getElementById("edit-button-container");
	buttondiv.style.display = "";

	cloneItems();

	Sortable.create(mainList, {
		animation: 150,
		onSort: updateAllLists
	});
}

function cloneItems()
{
	var columns = document.getElementsByClassName("player-list");
	for(var i = 0; i < columns.length; i++)
	{
		var newNode = mainList.cloneNode(true)
		newNode.classList.add("player-list");
		newNode.id = "";

		columns[i].replaceWith(newNode);

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

	// Colorize top vs not-top

	top.forEach(c => c.classList.remove("list-group-item-dark"));
	bottom.forEach(c => c.classList.add("list-group-item-dark"));

	// Sort not-top according to source list

	bottom.sort((a,b) => ordering[a.innerText] - ordering[b.innerText]);

	// Reinsert

	top.concat(bottom).forEach(c => list.appendChild(c));
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

	var source = document.getElementById("main-list-text");
	source.value = values.join("\n");
	source.parentNode.style.display = "";

	var buttondiv = document.getElementById("edit-button-container");
	buttondiv.style.display = "none";
}

function setup()
{
	var source = document.getElementById("main-list-text");
	source.onchange = handleSource;

	var edit_button = document.getElementById("edit-button");
	edit_button.onclick = handleEdit;

	var topN = document.getElementById("topN");
	topN.onchange = updateAllLists;
}


setup();
