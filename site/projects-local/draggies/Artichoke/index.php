<?php 
	$title = "Artichoke";
	include '../_head.php';
?>

<script>
	buildDraggy({
		container: document.body,
		prefix:    'arti',
		suffix:    '',
		start:     1,
		end:       59,
		speed:     0.08,
		width:     460,
		height:    346,
	});
</script>

<?php include '../_foot.php'; ?>