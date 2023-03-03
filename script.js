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

	Sortable.create(list, {
		animation: 150
	});

	list.style.display = "";

	var buttondiv = document.getElementById("edit-button-container");
	buttondiv.style.display = "";
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
}


setup();
