window.onload= function(){

	var canvas_width=900;
	var canvas_height=600;
	var block_size= 30;
	var snakee;
	var applee;
	var ctx;
	var delay=100;
	var widthInBlock= canvas_width/ block_size;
	var heightInBlock= canvas_height/ block_size;
	var score =0 ;
	var timeout ;
	init();

	function init() 
	{	
		//create canvace
		var canvas= document.createElement('canvas');
		//FORME de cANVACE
		canvas.width= 900;
		canvas.height=600;
		canvas.style.border='30px solid gray';
		canvas.style.margin= '50px auto' ;
		canvas.style.display= 'block' ;	
		canvas.style.backgroundColor='#ddd' ;
		//ajouter canvas au body
		document.body.appendChild(canvas);
		//create a contexe(grille) pour le canvace
		ctx=canvas.getContext('2d');
		//create le snake(ensemble des blocks)
		snakee= new Snake([ [6,4], [5,4], [4,4], [3,4], [2,4], [1,4] ], 'right' );
		applee=new Apple([10,10]);
		refresh_canvas();
	}

	function refresh_canvas()
	{	
		snakee.advance();
		//snake advance and check from the beginning  if it is outside the canvas 
		if(snakee.checkCollision())
		{
			gameOver();
			score= 0;
		}
		else
		{
			if(snakee.isEatingApple(applee))
			{	snakee.ateApple=true;
				score++;
				
				do
				{
					applee.setNewPosition();
				}
				while(applee.isOnSnake(snakee))
			}
			//nettoyer le context	
			ctx.clearRect(0, 0, canvas_width, canvas_height);
			//dessiner  le snake en utilisant la fonction draw definie ds le constructeur
			scoreDraw();
			snakee.draw();
			applee.draw();
			timeout= setTimeout(refresh_canvas, delay);	
		}	
		
	}
	function gameOver()
	{
		ctx.save();
		ctx.font='bold 50px sans-serif';
		ctx.fillStyle='#000' ;
		ctx.textAlign= 'center';
		ctx.textBaseline= 'middle';
		ctx.strokeStyle='white';
		ctx.lineWidth= 5;
		ctx.strokeText("Game Over", canvas_width/2, canvas_height/2 -180 );
		ctx.fillText("Game Over", canvas_width/2, canvas_height/2 -180 );

		ctx.font='bold 30px sans-serif';
		ctx.strokeText("pour rejouer appuyer sur Espace ", canvas_width/2, canvas_height/2 - 120);
		ctx.fillText("pour rejouer appuyer sur Espace ", canvas_width/2, canvas_height/2 - 120);
		
		ctx.restore();
	}
		
	
	function scoreDraw()
	{
		ctx.save();
		ctx.font='bold 200px sans-serif';
		ctx.fillStyle='gray' ;
		ctx.textAlign= 'center';
		ctx.textBaseline= 'middle';
		ctx.fillText(score.toString() ,canvas_width/2, canvas_height/2 );
		ctx.restore();
	}
	function restart ()
	{
		snakee= new Snake([ [6,4], [5,4], [4,4], [3,4], [2,4], [1,4] ], 'right' );
		applee=new Apple([10,10]);
		clearTimeout(timeout);
		refresh_canvas();
	}
	//fonction utilise ds func draw: pour dessiner un block
	function draw_block(ctx, position)
	{
		var x=position[0]*block_size;
		var y=position[1]*block_size;
		ctx.fillRect(x,y,block_size,block_size);

	}

//constructeur
	function Snake(body, direction) 
	{	this.ateApple= false;
		this.body=body;
		this.direction=direction;
		this.draw=function()
		{
			ctx.save();
			ctx.fillStyle="#4A632C";
			draw_block(ctx, this.body[0]);
			ctx.fillStyle="#7CA54A";
			for (var i = 1; i <this.body.length; i++) 
				{
					draw_block(ctx, this.body[i]);
				}
			ctx.restore();	
		};
		
		this.advance=function()
		{
			var nextposition=this.body[0].slice();// copier la tete de serpent =la 1 position
			
			//coder la direction selon la direction donnee
			switch(this.direction)
			{
				case 'right':
					nextposition[0] +=1;
					break;
				case 'left':
					nextposition[0] -=1;
					break;
				case 'up':
					nextposition[1] -=1;
					break;
				case 'down':
					nextposition[1] +=1;
					break;
				default:
					throw('invalid direction');
			}
			
			this.body.unshift(nextposition);
			if (!this.ateApple) 
			{
				this.body.pop();
			}
			else
			{
				this.ateApple=false;  
			}
		};
			//allowed direction selon la  direction actuelle
		this.setDirection=function(newDirection)
		{
			var allowedDirections;
			switch(this.direction)
			{
				case 'left' :
				case 'right' :
					allowedDirections=['up', 'down'];
					break;
				case 'up' :
				case 'down' :
					allowedDirections=['right', 'left'];
					break;
				default:
					throw('invalid direction');	
			}
			//modifier la direction du constructeur selon la direction code de bouton appyuie
			if(allowedDirections.indexOf(newDirection) >-1)
			{
				this.direction=newDirection;
			}
		};
		this.checkCollision=function()
		{		
			var wallCollision= false ;
			var snakeCollision= false;
			//on comapare  la position de head et la position dehors de canvas
			var head=this.body[0];
			var rest=this.body.slice(1);
			var snakeX=head[0];
			var snakeY=head[1];
			var minx= 0;
			var miny= 0;
			var maxx = widthInBlock-1;
			var	maxy = heightInBlock-1;
			var notInHor =snakeX> maxx || snakeX < minx ;
			var notInVer =snakeY> maxy || snakeY < miny ;
			if (notInVer || notInHor) 
			{
				wallCollision=true;
			}
			for (var i = 0 ; i < rest.length; i++)
			{
					if (snakeX === rest[i][0]  && snakeY === rest[i][1		]) 
					{
						snakeCollision=true;
					}	
			}
			return wallCollision || snakeCollision;	
		};

		this.isEatingApple=function(appleToEat)
		{
			var head= this.body[0];
			if(head[0]===appleToEat.position[0] && head[1]===appleToEat.position[1])
				return true; 
			else
				return false;
		};
			
	}
	function Apple(position)
	{
		this.position=position;
		this.draw=function()
		{
			ctx.save();
			ctx.fillStyle='#33cc33';
			ctx.beginPath();
			var radius=block_size/2;
			var x=this.position[0]*block_size+ radius;
			var y=this.position[1]*block_size+ radius;
			ctx.arc(x,y,radius, 0, Math.PI*2, true);
			ctx.fill();
			ctx.restore();
		}
		this.setNewPosition=function()
		{
			this.position[0]=Math.round(Math.random() *(widthInBlock- 1) ) ;
			this.position[1]=Math.round (Math.random() * (heightInBlock -1 )) ;
		};
		this.isOnSnake=function(snake)
		{
			var isOnSnake= false;
			for (var i = 0; i < snake.body.length; i++) {
				if (snake.body[i][0]===this.position[0] && snake.body[i][1]===this.position[1] ) 
				{
					isOnSnake=true ;
				}
			}
			return isOnSnake;
		};
	}

//lire les boutons appyyer par l utilisateur comme direction left , right , up , down
	document.onkeydown = function handleKeyDown(e)
	{
		var key=e.keyCode;
		switch(key)
		{
			case 37:
				newDirection='left';
				break;
			case 38:
				newDirection='up';
				break;
			case 39:
				newDirection='right';
				break;
			case 40:
				newDirection='down';
				break;
			case 32:
				restart () ;
				return;
			default: 
				return;
		}
		//prendre la direction de linput en compte seulemnt lorsque elle verifie les condition de set direction
		snakee.setDirection(newDirection);
	}
}