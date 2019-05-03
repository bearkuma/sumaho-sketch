window.onload = function () {
	var socketio = io.connect();
	//要素取得列挙
	var back = document.getElementById('back');
	var go = document.getElementById('go');
	var eraseAll = document.getElementById('eraseAll');
	var black = document.getElementById('black');
	var red = document.getElementById('red');
	var green = document.getElementById('green');
	var blue = document.getElementById('blue');
	var yellow = document.getElementById('yellow');
	var aqua = document.getElementById('aqua');
	var purple = document.getElementById('purple');
	var white = document.getElementById('white');
	var superthin = document.getElementById('superthin');
	var thin = document.getElementById('thin');
	var middle = document.getElementById('middle');
	var thick = document.getElementById('thick');
	var superthick = document.getElementById('superthick');
	var wrapper = document.getElementById('wrapper');
	var showingPencil = document.getElementById('showingPencil');
	var intoImg = document.getElementById('intoImg');
	//パネルボタンの挙動設定
	var colorSelect = document.getElementById('colorSelect');
	var boldSelect = document.getElementById('boldSelect');
	var colorBox = document.getElementById('colorBox');
	var boldBox = document.getElementById('boldBox');
	
	var sketchLog = [];//今までの全ての描写情報を保存する配列を用意
	var pathLog = [];//1つのパスの間の描写情報を保存する配列を用意
	var lineToXLog = [];//lineTo情報(X)を保存する配列を用意
	var lineToYLog = [];//lineTo情報(Y)を保存する配列を用意
	var memoryLog = [];//戻るボタンで消した描写情報を保存する配列を用意
	
	colorSelect.onclick = function(){		
  		if(colorBox.style.display === 'block') {
    		colorBox.style.display = 'none';
  		} else {
    		colorBox.style.display = 'block';
  		}
	}
	boldSelect.onclick = function(){
  		if(boldBox.style.display === 'block') {
    		boldBox.style.display = 'none';
  		} else {
    		boldBox.style.display = 'block';
  		}
	}
 //お絵かき張本体
	var canvas = document.getElementById('canvas');	
	var subcanvas = document.getElementById('subcanvas');	
	var backcanvas = document.getElementById('backcanvas');
	var finalcanvas = document.getElementById('finalcanvas');
	//cursor画像の初期設定
	canvas.style.cursor = 'url(color_pencils/black95.png) 0 95,auto';
		
	var w = wrapper.clientWidth;
	var h = wrapper.clientHeight;
	canvas.width = w;
	canvas.height = h;
	subcanvas.width = w;
	subcanvas.height = h;
	subcanvas.style.zIndex = -10;
	backcanvas.width = w;
	backcanvas.height = h;
	finalcanvas.width = w;
	finalcanvas.height = h;
	
	if (canvas && canvas.getContext){
		var ctx = subcanvas.getContext('2d');
		ctx.fillStyle = '#FFF';
		ctx.fillRect(0,0,w,h);
		ctx.strokeStyle = '#000';
		ctx.lineWidth =6;
		ctx.lineCap = 'round';
		//色の変更
			//cursor画像変更のためのメソッド作成(色変更)
			function getBold(){
				var beforeColorPencil = canvas.style.cursor;
				var boldString = beforeColorPencil.match('[0-9]{2,3}')[0];
				return boldString;
			}
		black.onclick = function(){
			canvas.style.cursor = 'url(color_pencils/black' + getBold() +'.png) 0 ' + getBold() + ',auto';
			showingPencil.innerHTML = '<img id = "pencil-picture" src="color_pencils/black111.png">';
			colorBox.style.display = 'none';
			ctx.strokeStyle = '#000';
		};
		red.onclick = function(){
			canvas.style.cursor = 'url(color_pencils/red' + getBold() +'.png) 0 ' + getBold() + ',auto';
			showingPencil.innerHTML = '<img id = "pencil-picture" src="color_pencils/red111.png">';
			colorBox.style.display = 'none';
			ctx.strokeStyle = '#F00';
		};
		green.onclick = function(){
			canvas.style.cursor = 'url(color_pencils/green' + getBold() +'.png) 0 ' + getBold() + ',auto';
			showingPencil.innerHTML = '<img id = "pencil-picture" src="color_pencils/green111.png">';
			colorBox.style.display = 'none';
			ctx.strokeStyle = '#0F0';
		};
		blue.onclick = function(){
			canvas.style.cursor = 'url(color_pencils/blue' + getBold() +'.png) 0 ' + getBold() + ',auto';
			showingPencil.innerHTML = '<img id = "pencil-picture" src="color_pencils/blue111.png">';
			colorBox.style.display = 'none';
			ctx.strokeStyle = '#00F';
		};
		yellow.onclick = function(){
			canvas.style.cursor = 'url(color_pencils/yellow' + getBold() +'.png) 0 ' + getBold() + ',auto';
			showingPencil.innerHTML = '<img id = "pencil-picture" src="color_pencils/yellow111.png">';
			colorBox.style.display = 'none';
			ctx.strokeStyle = '#FF0';
		};
		aqua.onclick = function(){
			canvas.style.cursor = 'url(color_pencils/aqua' + getBold() +'.png) 0 ' + getBold() + ',auto';
			showingPencil.innerHTML = '<img id = "pencil-picture" src="color_pencils/aqua111.png">';
			colorBox.style.display = 'none';
			ctx.strokeStyle = '#0FF';
		};
		purple.onclick = function(){
			canvas.style.cursor = 'url(color_pencils/purple' + getBold() +'.png) 0 ' + getBold() + ',auto';
			showingPencil.innerHTML = '<img id = "pencil-picture" src="color_pencils/purple111.png">';
			colorBox.style.display = 'none';
			ctx.strokeStyle = '#F0F';
		};
		white.onclick = function(){
			canvas.style.cursor = 'url(color_pencils/white' + getBold() +'.png) 0 ' + getBold() + ',auto';
			showingPencil.innerHTML = '<img id = "pencil-picture" src="color_pencils/white111.png">';
			colorBox.style.display = 'none';
			ctx.strokeStyle = '#FFF';
		};
		//太さの変更
			//cursor画像変更のためのメソッド作成(太さ変更)
		function changeBold(boldNum){
			var beforeBoldPencil = canvas.style.cursor;
			var afterBoldPencil = beforeBoldPencil.replace(/[0-9]{2,3}/g,boldNum);
			canvas.style.cursor = afterBoldPencil;
		}
		superthin.onclick = function(){
			changeBold(50);
			boldBox.style.display = 'none';
			ctx.lineWidth = 1;
		};
		thin.onclick = function(){
			changeBold(75);
			boldBox.style.display = 'none';
			ctx.lineWidth = 3;
		};
		middle.onclick = function(){
			changeBold(95);
			boldBox.style.display = 'none';
			ctx.lineWidth = 6;
		};
		thick.onclick = function(){
			changeBold(111);
			boldBox.style.display = 'none';
			ctx.lineWidth = 9;
		};
		superthick.onclick = function(){
			changeBold(125);
			boldBox.style.display = 'none';
			ctx.lineWidth = 14;
		};
		//全消の実装
		eraseAll.onclick = function(){
			if(window.confirm('全て消します。本当によろしいですか？')){	
			//ctx.fillStyle = '#FFF';
			//ctx.fillRect(0,0,w,h);
			socketio.emit('eraseAll',{msg:'clear'})
				
			}
		};
		//ポインタの座標を取得
		var offsetX1;
		var offsetY1;
		canvas.addEventListener('touchstart',function(e){
		var touchObj = e.changedTouches[0] ;
		var mouseX1 = touchObj.pageX;
		var mouseY1 = touchObj.pageY;
		var canvasRect = canvas.getBoundingClientRect();
		var positionX1 = canvasRect.left + window.pageXOffset;
		var positionY1 = canvasRect.top + window.pageYOffset;	
		offsetX1 = mouseX1 - positionX1;
		offsetY1 = mouseY1 - positionY1;
		});
		var offsetX2;
		var offsetY2;
		canvas.addEventListener('touchmove',function(e){
		var touchObj = e.changedTouches[0] ;
		var mouseX2 = touchObj.pageX;
		var mouseY2 = touchObj.pageY;
		var canvasRect = canvas.getBoundingClientRect();
		var positionX2 = canvasRect.left + window.pageXOffset;
		var positionY2 = canvasRect.top + window.pageYOffset;	
		offsetX2 = mouseX2 - positionX2;
		offsetY2 = mouseY2 - positionY2;
		});
		var offsetX3;
		var offsetY3;
		canvas.addEventListener('touchend',function(e){
		var touchObj = e.changedTouches[0] ;
		var mouseX3 = touchObj.pageX;
		var mouseY3 = touchObj.pageY;
		var canvasRect = canvas.getBoundingClientRect();
		var positionX3 = canvasRect.left + window.pageXOffset;
		var positionY3 = canvasRect.top + window.pageYOffset;	
		offsetX3 = mouseX3 - positionX3;
		offsetY3 = mouseY3 - positionY3;
		});
		var offsetX4;
		var offsetY4;
		canvas.addEventListener('touchleave',function(e){
		var touchObj = e.changedTouches[0] ;
		var mouseX4 = touchObj.pageX;
		var mouseY4 = touchObj.pageY;
		var canvasRect = canvas.getBoundingClientRect();
		var positionX4 = canvasRect.left + window.pageXOffset;
		var positionY4 = canvasRect.top + window.pageYOffset;	
		offsetX4 = mouseX4 - positionX4;
		offsetY4 = mouseY4 - positionY4;
		});
		var offsetX5;
		var offsetY5;
		canvas.addEventListener('touchenter',function(e){
		var touchObj = e.changedTouches[0] ;
		var mouseX5 = touchObj.pageX;
		var mouseY5 = touchObj.pageY;
		var canvasRect = canvas.getBoundingClientRect();
		var positionX5 = canvasRect.left + window.pageXOffset;
		var positionY5 = canvasRect.top + window.pageYOffset;	
		offsetX5 = mouseX5 - positionX5;
		offsetY5 = mouseY5 - positionY5;
		});
		
		
		//左ボタンが押されたら描画準備
	
		canvas.ontouchstart = function(e){
			ctx.beginPath();
			ctx.moveTo(offsetX1,offsetY1);
			ctx.lineTo(offsetX1,offsetY1);
			lineToXLog.push(offsetX1);
			lineToYLog.push(offsetY1);
			ctx.stroke();
			
			socketio.emit('touchstart',{x:offsetX1,y:offsetY1,x2:offsetX4,y2:offsetY4,style:ctx.strokeStyle,width:ctx.lineWidth})
		};
		//ポインタが動いたら描画
		canvas.ontouchmove = function(e){
			memoryLog = [];
			ctx.lineTo(offsetX2,offsetY2);
			lineToXLog.push(offsetX2);
			lineToYLog.push(offsetY2);
			ctx.stroke();
			
			socketio.emit('touchmove',{x:offsetX2,y:offsetY2,style:ctx.strokeStyle,width:ctx.lineWidth})
			
		};
		
		/*左ボタンが離されたらpathLogを作成し、sketchLogへ保存後削除する。
		　また、lineToXLogとlineToYLogも初期化しておく。
		*/
		canvas.ontouchend = function(e){
			pathLog.push(ctx.strokeStyle,ctx.lineWidth,offsetX1,offsetY1,lineToXLog,lineToYLog);
			sketchLog.push(pathLog);
			pathLog = [];
			lineToXLog =[];
			lineToYLog =[];
			
			socketio.emit('touchend',{x:offsetX1,y:offsetY1,style:ctx.strokeStyle,width:ctx.lineWidth,lineToXlog:lineToXLog,lineToYLog:lineToYLog})
		};
		//ポインタが画面外へ出て行った時の挙動
		canvas.onTouchLeave = function (e){
			memoryLog = [];
			pathLog.push(ctx.strokeStyle,ctx.lineWidth,offsetX1,offsetY1,lineToXLog,lineToYLog);
			sketchLog.push(pathLog);
			pathLog = [];
			lineToXLog =[];
			lineToYLog =[];
			
			socketio.emit('TouchLeave',{x:offsetX1,y:offsetY1,style:ctx.strokeStyle,width:ctx.lineWidth,lineToXlog:lineToXLog,lineToYLog:lineToYLog})
		};
		//ポインタが画面内へ入った時の挙動
	canvas.onTouchEnter = function(e){
			 ctx.beginPath();
			 ctx.moveTo(offsetX5,offsetY5);
			 offsetX1 = offsetX5;
			 offsetY1 = offsetY5;
			
			socketio.emit('TouchEnter',{x:offsetX5,y:offsetY5})
		};
		//戻るボタンと進むボタンの挙動
		
		back.onclick = function(){
			if(sketchLog.length > 0){
				ctx.save(); 
				ctx.fillStyle = '#FFF';
				ctx.fillRect(0,0,w,h);
				memoryLog.push(sketchLog.pop());
				for (var i = 0; i < sketchLog.length; i++){
					ctx.beginPath();
					ctx.strokeStyle = sketchLog[i][0];
					ctx.lineWidth = sketchLog[i][1];
					ctx.moveTo(sketchLog[i][2],sketchLog[i][3]);
					for (var k = 0; k < sketchLog[i][4].length; k++){
						ctx.lineTo(sketchLog[i][4][k],sketchLog[i][5][k]);
					}
					ctx.stroke();
				}
				ctx.restore();
			}
		}
		go.onclick = function(){
			if(memoryLog.length > 0){
				ctx.save();
				ctx.fillStyle = '#FFF';
				ctx.fillRect(0,0,w,h);
				sketchLog.push(memoryLog.pop());
				for (var i = 0; i < sketchLog.length; i++){
					ctx.beginPath();
					ctx.strokeStyle = sketchLog[i][0];
					ctx.lineWidth = sketchLog[i][1];
					ctx.moveTo(sketchLog[i][2],sketchLog[i][3]);
					for (var k = 0; k < sketchLog[i][4].length; k++){
						ctx.lineTo(sketchLog[i][4][k],sketchLog[i][5][k]);
					}
					ctx.stroke();
				}
				ctx.restore();
			}
		}
		var progress = document.getElementById('progress');
		//画像化して保存する
		intoImg.onclick = function(){
			progress.setAttribute("value",0);
			socketio.emit('getallusers',{msg:'please'});
			backcanvas.style.zIndex = 99;
			finishmsg.style.zIndex = 100;
			finishmsg.style.display = 'block';
		};
		
		
		var finishmsg = document.getElementById('finishmsg');
		socketio.on('getallusers', function(data){
			//finalcanvas実装

			var fctx = finalcanvas.getContext('2d');
			fctx.fillStyle = '#FFF';
			fctx.fillRect(0,0,w,h);
			//finalcanvas.style.zIndex = 100;
			/*ctx.fillStyle = '#FFF';
			ctx.fillRect(0,0,w,h);
			for (var i = 0; i < sketchLog.length; i++){
					ctx.beginPath();
					ctx.strokeStyle = sketchLog[i][0];
					ctx.lineWidth = sketchLog[i][1];
					ctx.moveTo(sketchLog[i][2],sketchLog[i][3]);
					for (var k = 0; k < sketchLog[i][4].length; k++){
						ctx.lineTo(sketchLog[i][4][k],sketchLog[i][5][k]);
					}
					ctx.stroke();
			}
			*/
			//var imgUrl =subcanvas.toDataURL();
			/*
			function createImage(context){
  				var image= new Image;
  				image.src= context.canvas.toDataURL();
  				return image;
			}
			*/
			var subcanvas = document.getElementById('subcanvas');
			//var context = subcanvas.getContext('2d');
			var image1 = new Image;
			image1.src = subcanvas.toDataURL();
			image1.onload = function() {
				fctx.drawImage(image1,0,0);
				drawothers();
				image1.src = '';
			}
			
			
			
			
			function drawothers(){
				//for( var i = 0; i < data.users.length; i++){
				var i = 0;
				progress.setAttribute("max",(data.users.length-1));
				finalize();
				function finalize(){
					progress.setAttribute("value",i);
					if(data.users[i] != myId){
						var mycanvas = document.getElementById(data.users[i]);
						//var context = selectcanvas.getContext('2d');
						var image2 = new Image;
						image2.src = mycanvas.toDataURL();
						image2.onload = function() {
						async function datareading(){	
							fctx.drawImage(image2,0,0);
							//image2.src = '';
							console.log(i);		
						}
						datareading().then(finalizingcheck());
						//datareading().then(v => finalizingcheck());
						}
					
						//}
					} else {
						finalizingcheck();
					}
						function finalizingcheck(){
						if(i === data.users.length - 1){
							drawfinish();
							console.log('終了')
						} else {
							i++;
							finalize();
						}
						}
					//}
				}
				//}
					
			}
			
			function drawfinish(){
				finishmsg.style.display = 'none';
				backcanvas.style.zIndex = -100;
         		var filename = prompt('何というファイル名で保存しますか')
            		if(filename){
						var imgUrl =finalcanvas.toDataURL();
						var mydraw = document.createElement('a');
              	  		mydraw.download = filename+'.png';
                		mydraw.href = imgUrl;
                		document.body.appendChild(mydraw);
                		mydraw.click();
                		document.body.removeChild(mydraw);
						window.open(imgUrl);
						mydraw.href = '';
						fctx.clearRect(0,0,w,h);
					}
				//finalcanvas.style.zIndex = -100;
			}
		});
					
					

					
	
		
		
		
		
	
		
		start();
		function start(){
			socketio.emit('enter',{value: '入室'});
		}
		
		var myId = null;
		socketio.on('onlyMe', function(data){
			 if(data.users != undefined){
			for(i = 0; i<data.users.length; i++){
				var mycanvas = document.createElement('canvas');
				mycanvas.width = w;
				mycanvas.height = h;
				mycanvas.id = data.users[i];
				wrapper.appendChild(mycanvas);
				mycanvas.style.position = 'absolute';
				mycanvas.style.top = 0;
				mycanvas.style.left = 0;
				mycanvas.style.zIndex = -10;
				myId = data.userId;
				
			}
			}
		});
		
		socketio.on('enter', function(data){
			var mycanvas = document.createElement('canvas');
			mycanvas.width = w;
			mycanvas.height = h;
			mycanvas.id = data.userId;
			wrapper.appendChild(mycanvas);
			mycanvas.style.position = 'absolute';
			mycanvas.style.top = 0;
			mycanvas.style.left = 0;
			mycanvas.style.zIndex = -10;
		});
		
		var moverNum = 0;
		socketio.on('touchstart', function(data){
			var thiscanvas = document.getElementById(data.userId);
			data.userId = thiscanvas.getContext('2d');
			//data.userId = canvas.getContext('2d');
			//data.userId.strokeStyle = data.style;
			//data.userId.lineWidth = data.width;
			if(moverNum === 0){
			 mdown(data.x,data.y);
			} else {
			 mdown(data.x2,data.y2);
			 moverNum = 0;
			}
			function mdown(x,y){
			//data.userId.save();
			data.userId.strokeStyle = data.style;
			data.userId.lineWidth = data.width;
			
			data.userId.beginPath();
			data.userId.moveTo(x,y);
			data.userId.lineTo(x,y);
			//lineToXLog.push(x);
			//lineToYLog.push(y);
			data.userId.stroke();
			//data.userId.restore();
			}
		});
		socketio.on('touchstart', function(data){
			var thiscanvas = document.getElementById(data.userId);
			data.userId = thiscanvas.getContext('2d');
			//data.userId = canvas.getContext('2d');
			mmove(data.x,data.y);
			function mmove(x,y){
			//data.userId.save();
			data.userId.strokeStyle = data.style;
			data.userId.lineWidth = data.width;
			data.userId.lineTo(x,y);
			//data.userId.moveTo(x,y);
			//lineToXLog.push(x);
			//lineToYLog.push(y);
			data.userId.stroke();
			//data.userId.restore();
			}
		});
		/*
		socketio.on('mouseup', function(data){
			data.userId = canvas.getContext('2d');
			mup(data.style,data.width,data.x,data.y,data.lineToXlog,data.lineToYLog);
			function mup(style,width,x,y,lineToXLog,lineToYLog){
			pathLog.push(style,width,x,y,lineToXLog,lineToYLog);
			sketchLog.push(pathLog);
			pathLog = [];
			lineToXLog =[];
			lineToYLog =[];
			}
		});
		
		socketio.on('mouseout', function(data){
			data.userId = canvas.getContext('2d');
			mout(data.style,data.width,data.x,data.y,data.lineToXlog,data.lineToYLog);
			function mout(style,width,x,y,lineToXLog,lineToYLog){
			memoryLog = [];
			pathLog.push(style.width,x,y,lineToXLog,lineToYLog);
			sketchLog.push(pathLog);
			pathLog = [];
			lineToXLog =[];
			lineToYLog =[];
			}
		});
	
		*/
		socketio.on('touchend', function(data){
			data.userId = canvas.getContext('2d');
			mover(data.x,data.y);
			function mover(x,y){
			data.userId.beginPath();
			data.userId.moveTo(x,y);
			//moverNum = 1;
		}
		});
		
		socketio.on('eraseAll', function(data){
			if(data.users.length >= 1){
				
				for(var i = 0; i < data.users.length; i++){
						if(data.users[i] != myId){
							
						var erasecanvas = document.getElementById(data.users[i]);
						
						data.users[i]= erasecanvas.getContext('2d');
						data.users[i].clearRect(0,0,w,h);
						//data.users[i].fillStyle = '#FFF';
						//data.users[i].fillRect(0,0,w,h);
							
						/*data.users[i].strokeStyle = '#FFF';
						data.users[i].lineWidth = h/3;
						data.users[i].beginPath();
						data.users[i].moveTo(0,h/2);
						data.users[i].lineTo(w,h/2);
						data.users[i].stroke();
						*/
					} else if(data.users[i] === myId){
						
						ctx.fillStyle = '#FFF';
						ctx.fillRect(0,0,w,h);
						pathLog.push("#FFF",h,0,h/2,[w],[h/2]);
						sketchLog.push(pathLog);		
						pathLog = [];
						
					}
				}
				
			} 
				/*
				ctx.fillStyle = '#FFF';
				ctx.fillRect(0,0,w,h);
				pathLog.push("#FFF",h,0,h/2,[w],[h/2]);
				sketchLog.push(pathLog);		
				pathLog = [];
				*/
			
		});
		
	}
}
