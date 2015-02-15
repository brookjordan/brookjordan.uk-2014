
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Draggie | Person</title>
	<link rel="stylesheet" href="main.css">
</head>
<body>

	<p>Choose one:</p>
	<p>
		<a href="/">&laquo; Home</a>
		<a href="Artichoke">Artichoke</a>
		<a href="Banana">Banana</a>
		<a href="Brocolli">Brocolli</a>
		<a href="Head">Head</a>
		<a href="Human">Human</a>
	</p>

	<script src="js/shivs.js"></script>
	<script src="js/main.js"></script>
<script>
	buildDraggy({
		container: document.body,
		prefix:    '2512---',
		suffix:    '',
		pad:       4,
		start:     1,
		end:       93,
		speed:     0.2,
		width:     360,
		height:    209,
	});
</script>

</body>
</html>