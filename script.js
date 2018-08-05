// In this game, the opponent cars and road's lines move down which creates the effect of we going ahead
$(function(){

	var anim_id;

	// saving DOM objects to variables
	var container = $('#container');
	var car = $('#car');
    var car_1 = $('#car_1');
    var car_2 = $('#car_2');
    var car_3 = $('#car_3');
    var line_1 = $('#line_1');
    var line_2 = $('#line_2');
    var line_3 = $('#line_3');
    var restart_div = $('#restart_div');
    var restart_btn = $('#restart');
    var score = $('#score');

    //saving some initial setup
    //(we can use .css only with those properties which we have declared in css file)
    var container_left = parseInt(container.css('left'));
    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var car_width = parseInt(car.width());
    var car_height = parseInt(car.height());

    // some other declarations
    var game_over = false;

    var score_counter = 0;

    var speed = 2;
    var line_speed = 5;

    var move_up = false;
    var move_down = false;
    var move_right = false;
    var move_left = false;

/* ------------------------------GAME CODE STARTS HERE------------------------------------------- */



// ---------------- USER'S CAR CONTROLS -----------------------------------------------

    $(document).on('keydown', function(e){
       
       if (game_over === false){
       	
       	let key = e.keyCode;
    	
    	if (key === 37 && move_left === false){
    		move_left = requestAnimationFrame(left);
    	}

    	if (key === 39 && move_right === false){
    		move_right = requestAnimationFrame(right);
    	}

    	if (key === 38 && move_up === false){
    		move_up = requestAnimationFrame(up);
    	}

    	if (key === 40 && move_down === false){
    		move_down = requestAnimationFrame(down);
    	}

       }
    });

    $(document).on('keyup', function(e){
    	if (game_over === false){
    		let key = e.keyCode;
    		if (key === 37){
    			cancelAnimationFrame(move_left);
    			move_left = false;
    			// we updated move_left to false as it was assigned true when requestAnimationFrame (a recursive function) was called.
    		}

    		if (key === 39){
    			cancelAnimationFrame(move_right);
    			move_right = false;
    		}

    		if (key === 40){
    			cancelAnimationFrame(move_down);
    			move_down = false;
    		}

    		if (key === 38){
    			cancelAnimationFrame(move_up);
    			move_up = false;
    		}
    	}
    });


// These controls are recursive functions which have base case/function which ends the recursive loop as 'keyup' event.    

    function left(){
       	if(game_over === false && parseInt(car.css('left')) > 0){
       		car.css('left', parseInt(car.css('left'))-5);
       		move_left = requestAnimationFrame(left);
       	}
       }
    
    function right(){
       	if(game_over === false && parseInt(car.css('left')) < container_width - car_width){
       		car.css('left', parseInt(car.css('left'))+5);
       		move_right = requestAnimationFrame(right);
       	}
       }

    function down(){
       	if(game_over === false  && parseInt(car.css('bottom')) > 0){
       		car.css('bottom', parseInt(car.css('bottom'))-3);
       		move_down = requestAnimationFrame(down);
       	}
       }

    function up(){
       	if(game_over === false && parseInt(car.css('bottom')) < container_height- car_height){
       		car.css('bottom', parseInt(car.css('bottom'))+6);
       		move_up = requestAnimationFrame(up);
       	}
       }       


// ----------------MOVING DOWN THE CARS AND ROAD's LINES---------------------------------------

// requestAnimationFrame is a recursive function which has 'repeat' as the id (function/variable passed in it). Then, repeat function calls this recursive function again.
// stopping the game at any collision 

    anim_id = requestAnimationFrame(repeat);

    function repeat() {
    	if (game_over === false){

    		if (collision(car, car_1) || collision(car, car_2) || collision(car, car_3)) {
    			stop_the_game();
    		}

    		score_counter++;
    		if (score_counter % 20 === 0) {
    			score.text(parseInt(score.text())+1);
    		}
    		if (score_counter % 500 === 0) {
    			speed++;
    			line_speed++;
    		}

    		car_down(car_1);
    		car_down(car_2);
    		car_down(car_3);
    		line_down(line_1);
    		line_down(line_2);
    		line_down(line_3);

    		anim_id = requestAnimationFrame(repeat);
    	}
    }

// cancelling all the running animations and not allowing car's movement after collision. Sliding down the restart button, as it's height and width was 100%, after sliding down it will cover the container entirely.
    function stop_the_game() {
    	game_over = true;
    	cancelAnimationFrame(anim_id);
    	cancelAnimationFrame(move_right);
    	cancelAnimationFrame(move_up);
    	cancelAnimationFrame(move_left);
    	cancelAnimationFrame(move_down);
    	window.alert("Oops, you crashed!");
    	restart_div.slideDown();
    }

    $(document).ready(function(){
    	restart_btn.click(function(){
    		window.location.reload();
    	});
    });

// to make the cars appear again, at random positions on the basis of left distance, after they go out of container.
// we could have written car also instead of x, it's just to avoid confusion.
    function car_down(x) { 
    	let current_top = parseInt(x.css('top'));

    	if (current_top > container_height){
    		current_top = -200;
    		x.css('left', parseInt(Math.random()*(container_width - car_width) ));
    	}
    	x.css('top', current_top + speed);
    }

// to make the lines appear again after they go out of container_height
    function line_down(x) {
    	let current_top = parseInt(x.css('top'));
     	
    	if (current_top > container_height){
    		current_top = -300;
    	}    	
    	x.css('top', current_top + line_speed);
    }

/* ------------------------------GAME CODE ENDS HERE------------------------------------------- */

// Logic for collision between two objects
    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }
});