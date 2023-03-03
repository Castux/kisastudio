function handleSource(ev)
{
	var values = ev.target.value.split('\n');
	ev.target.parentNode.style.display = "none";

	var list = document.getElementById("main-list");

	values.forEach(v =>
	{
		if (v == "") return;

		var elem = document.createElement("div");
		elem.classList.add("list-group-item", "py-1");
		elem.innerHTML = v;

		list.appendChild(elem);
	});

	list.style.display = "";

	var buttondiv = document.getElementById("edit-button-container");
	buttondiv.style.display = "";

	cloneItems();

	Sortable.create(list, {
		animation: 150
	});
}

function cloneItems()
{
	var list = document.getElementById("main-list");

	var columns = document.getElementsByClassName("player-list");
	for(var i = 0; i < columns.length; i++)
	{
		var newNode = list.cloneNode(true)
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

function updateAllLists()
{
	for(list of document.getElementsByClassName("player-list"))
	{
		updateList(list);
	}
}

function updateList(list)
{
	var topN = document.getElementById("topN").value;

	for(var i = 0 ; i < list.childNodes.length ; i++)
	{
		if (i < topN)
			list.childNodes[i].classList.remove("list-group-item-dark");
		else
			list.childNodes[i].classList.add("list-group-item-dark");
	}
}

function handleEdit(ev)
{
	var values = [];
	var list = document.getElementById("main-list");
	for (c of list.children)
	{
		values.push(c.innerHTML);
	}
	list.replaceChildren();
	list.style.display = "none";

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
