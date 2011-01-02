<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"DTD/xhtml1-strict.dtd">

<html>
<head>
	<title>Minebroom</title>
	<link type="text/css" href="css.css" rel="stylesheet" />
	<link type="text/css" href="jqui/css/smoothness/jquery-ui-1.7.1.custom.css" rel="stylesheet" />
	<style type="text/css">
		body {
			text-align:center;
			font-family:sans-serif;
		}
		#container {
			text-align:left;
			margin:0 auto;
			width:500px;
		}
		.setting {
			margin:10px 0;
		}
	</style>
</head>
<body>
	<div id="container">
		<h1>Minebroom</h1>
		<p>Minebroom is the best mine hunting game on the internet. To play, choose your difficulty settings.</p>
		<div class="setting dif">
			<strong>Medium</strong>
			<div id="difficulty"><a href="#"></a></div>
		</div>
		<div class="setting len">
			<strong>Medium</strong>
			<div id="length"><a href="#"></a></div>
		</div>
		<form action="game.php" method="post">
			<input type="hidden" name="width" value="30" id="iwidth" />
			<input type="hidden" name="height" value="16" id="iheight" />
			<input type="hidden" name="mines" value="99" id="imines" />
			<button class="fg-button ui-state-default ui-corner-all" type="submit">Play</button>
		</form>
	</div>
	
	<script type="text/javascript" src="jquery.js"></script>
	<script type="text/javascript" src="jqui/jqui.js"></script>
	<script type="text/javascript">
		function g(x){
			return document.getElementById(x);
		}
		$(function(){
			
			// Slider
			$('#difficulty').slider({
				value:2,
				min:1,
				max:5,
				slide:function(e,ui){
					var dif = $('.dif strong');
					g('iwidth').value = ui.value * 9 * 2;
					g('iheight').value = ui.value * 9;
					switch(ui.value){
						case 1:
							dif.html('Easy');
							break;
						case 2:
							dif.html('Medium');
							break;
						case 3:
							dif.html('Hard');
							break;
						case 4:
							dif.html('Extreme');
							break;
						case 5:
							dif.html('Clusterfuck');
							break;
					}
				}
			});
			$('#length').slider({
				value:20,
				min:10,
				max:70,
				slide:function(e,ui){
					var dif = $('.len strong');
					g('imines').value = Math.E ^ (ui.value) * 11;
					switch(Math.floor(ui.value / 20)){
						case 0:
							dif.html('Easy');
							break;
						case 1:
							dif.html('Medium');
							break;
						case 2:
							dif.html('Hard');
							break;
						case 3:
							dif.html('Suicide');
							break;
					}
				}
			});
		});
	</script>
	
</body>
</html>