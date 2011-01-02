<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"DTD/xhtml1-strict.dtd">

<html>
<head>
	<title>Minebroom</title>
	<link type="text/css" href="css.css" rel="stylesheet" />
</head>
<body>
	<div id="container">
		<h1>Minebroom</h1>
		<div id="controls">
			<span id="timer">000</span>
			<span id="mines"><?=intval(isset($_REQUEST['mines'])?$_REQUEST['mines']:99)?></span>
			<a id="guy" href="#" onmousedown="return guydown();" onmouseup="return guyup();">Cool Guy</a>
		</div>
		<div id="board">
			<div class="clear"></div>
		</div>
	</div>
	
	<script type="text/javascript" src="jquery.js"></script>
	<script type="text/javascript">
		var width = <?=intval(isset($_REQUEST['width'])?$_REQUEST['width']:30)?>, height = <?=intval(isset($_REQUEST['height'])?$_REQUEST['height']:16)?>;
		var mines = <?=intval(isset($_REQUEST['mines'])?((int)$_REQUEST['height'] * (int)$_REQUEST['width'] * ((int)$_REQUEST['mines'] / 100)):99)?>;
	</script>
	<script type="text/javascript" src="game.js"></script>
	
</body>
</html>