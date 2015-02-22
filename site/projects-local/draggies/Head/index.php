<?php 
	$title = "Head";
	include '../_head.php';
?>


<script>
	buildDraggy({
		container: document.body,
		prefix:    'Head',
		suffix:    '',
		start:     1,
		end:       297,
		speed:     0.02,
		width:     250,
		height:    258
	});
</script>

<?php include '../_foot.php'; ?>