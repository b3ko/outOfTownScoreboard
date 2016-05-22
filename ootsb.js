//color variables
var outsOn = "rgb(255,0,0)";
var outsOff = "rgb(100,0,0)";
var innOn = "rgb(40,255,0)";
var innOff = "rgb(00,100,0)";
var baseOn  = "rgb(25,25,255)";
var baseOff = "rgb(0,0,100)";

//elements - these are what will be updated by the code - these parameters are what the code will use to set the "LED" states
var out1 = outsOff;
var out2 = outsOff;
var innTop = innOn;
var innBot = innOff;
var base1st = baseOff;
var base2nd = baseOff;
var base3rd = baseOff;

//for all the digits. physical version will need to be slightly different depending on what type of digit display used.
var inningNum = "-";
var scoreAwayNum = "-";
var scoreHomeNum = "-"

//init the field and all values.
var intervalID;
var t = document.getElementById("teams"); //the team select list
var team = "";
$( "#teams" ).change(function() {
	team = t.options[t.selectedIndex].value; //grab the team on change
	//refresh every 5 second
	drawField();
	if(intervalID)
	{
		clearInterval(intervalID);
	}
	intervalID = window.setInterval(getScores, 5000);
});

/****
this funciton will draw the entire field and set all the values
all LEDs that can be turned on or off will use the global variables.
global variables will be updated by the getScores funciton.
*/
 function drawField() {
	var canvas = document.getElementById('diamond');
	var ctx = canvas.getContext('2d');
	drawStaticParts(ctx);

    //outs - one out
	ctx.fillStyle = out1;
	ctx.beginPath();
	ctx.arc(170, 170, 20, 0, 2 * Math.PI);
	ctx.fill();
	//two outs
	ctx.fillStyle = out2;
	ctx.beginPath();
	ctx.arc(230, 170, 20, 0, 2 * Math.PI);
	ctx.fill();

	//innings:
	ctx.fillStyle = "rgb(10,10,10)";
	ctx.fillRect(410, 100, 130,200);
	//borders (inning half)
	ctx.fillStyle = "rgba(100,100,100,.3)";
	ctx.beginPath();
	ctx.arc(475, 50, 22, 0, 2 * Math.PI); //top
	ctx.fill();
	ctx.beginPath();
	ctx.arc(475, 350, 22, 0, 2 * Math.PI); //bottom
	ctx.fill();

	//inning half - top
	ctx.fillStyle = innTop;
	ctx.beginPath();
	ctx.arc(475, 50, 20, 0, 2 * Math.PI);
	ctx.fill();
	// bottom
	ctx.fillStyle = innBot;
	ctx.beginPath();
	ctx.arc(475, 350, 20, 0, 2 * Math.PI);
	ctx.fill();

	//score:
	ctx.fillStyle = "rgb(10,10,10)"; //boxes
	//away
	ctx.fillRect(550, 25, 225,170);
	//home
	ctx.fillRect(550, 200, 225,170);

	//inning
	ctx.font = "150px sans-serif";
	ctx.fillStyle = "yellow"; //numbers
	ctx.fillText(inningNum, 435, 250);

	//score away
	ctx.fillText(scoreAwayNum, 623, 160);
	//score home
	ctx.fillText(scoreHomeNum, 623, 340);
 };

function makeBase (ctx, baseColor){
	//base
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.beginPath();
    ctx.moveTo(0,200);
    ctx.lineTo(40,160);
    ctx.lineTo(80,200);
    ctx.lineTo(40,240);
    ctx.fill();

    //base "light"
    ctx.beginPath();
    ctx.fillStyle = baseColor;
	ctx.arc(39, 200, 20, 0, 2 * Math.PI);
	ctx.fill();
}

function drawStaticParts(ctx) {
	//basepath
	ctx.fillStyle = "rgb(250,250,50)"; //yellow
	ctx.beginPath();
    ctx.moveTo(0,200);
    ctx.lineTo(200,400);
    ctx.lineTo(400,200);
    ctx.lineTo(200,0);
    ctx.fill();
	//infield
	ctx.fillStyle = "rgb(10,200,50)"; //green
	ctx.beginPath();
    ctx.moveTo(25,200);
    ctx.lineTo(200,375);
    ctx.lineTo(375,200);
    ctx.lineTo(200,25);
    ctx.fill();

    //bases
    ctx.save();
	makeBase(ctx, base3rd);
	ctx.translate(320,0);
	makeBase(ctx, base1st);
	ctx.translate(-160,-160);
	makeBase(ctx, base2nd);
	ctx.restore();

	//homeplate
	ctx.fillStyle = "rgb(255,255,255)"; //white
	ctx.beginPath();
    ctx.moveTo(200,400);
    ctx.lineTo(160,360);
    ctx.lineTo(160,330);
    ctx.lineTo(240,330);
    ctx.lineTo(240,360);
    ctx.fill();
}

function getScores() {
	var xhttp = new XMLHttpRequest();

	//get today's date and break it into parts
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth() + 1;
	var year = today.getUTCFullYear();
	var time = today.getHours();

	//if games run in to midnight we will subtract a day so the file remains the same as before midnight.
	//i am just looking to see if the time is between midnight and 6 am (since there are no games that start that early and if so, go back to last night)
	if (time >= 0 && time <= 6)
	{
		day--;
	}

	//if the day or month is less than 10 add the leading zero
	if(day < 10)
	{
		day = "0" + day;
	}

	if(month < 10)
	{
		month = "0" + month;
	}

	//build the url based on today's date parts
	var url = "http://gd2.mlb.com/components/game/mlb/year_" + year + "/month_" + month + "/day_" + day + "/scoreboard.xml";
	//open the xml
	xhttp.open("GET", url);
	xhttp.send();
	var indx = -1; //default value for the team we want, -1 means the team wasn't found.

	xhttp.onreadystatechange = function() { //listen for the state change
		if (xhttp.readyState == 4 && xhttp.status == 200)  //wait for ready state and 200.
		{
			xmlDoc = xhttp.responseXML;
			txt = "";
			//x = xmlDoc.getElementsByTagName("ig_game"); //grab the game elements
			var p = xmlDoc.getElementsByTagName("scoreboard");
			x = p[0].children; //grab the game elements

			for (i = 0; i < x.length; i++) //loop through the games until we get the game we want]
			{
				if(x[i].childNodes[1].id.includes(team))
				indx = i; //change this to a while loop?
			}

			if(indx >= 0) { //did we find the team we wanted, if so proceed
				//get all the needed values
				var scoreHome = x[indx].children[1].children[0].attributes.R.value;
				var scoreAway = x[indx].children[2].children[0].attributes.R.value;
				var status = x[indx].children[0].attributes.status.value;
				if(status == "IN_PROGRESS")
				{
					var outs = x[indx].attributes.outs.value;
					var inning = x[indx].children[3].attributes.inning.value;
					var half = x[indx].children[3].attributes.half.value;
					//there can be up to 3 bases tags. manually check for each
					var bases = [];
					if (x[indx].children[6])
					{
						bases[0] = x[indx].children[6].attributes.base.value;
					}
					if (x[indx].children[7])
					{
						bases[1] = x[indx].children[7].attributes.base.value;
					}
					if (x[indx].children[8])
					{
						bases[2] = x[indx].children[8].attributes.base.value;
					}

					//turn stuff on and off.
					//outs
					//default to off (this will be true for 0 outs, 3 outs and errors, no game, etc.)
					out1 = outsOff;
					out2 = outsOff;

					switch (outs) {
					case "1":
						out1 = outsOn;
						break;
					case "2":
						out1 = outsOn;
						out2 = outsOn;
						break;
					}
					//top or bottom or inning. default to top unless successfully find "B"
					if(half == "B")
					{
						innTop = innOff;
						innBot = innOn;
					}
					else
					{
						innTop = innOn;
						innBot = innOff;
					}

					//innings:
					inningNum = inning;

					//check all three bases -
					//note that the bases can be in any order. so check all three and turn on the ones that are needed.
					//default to off
					base1st = baseOff;
					base2nd = baseOff;
					base3rd = baseOff;
					for(var i = 0; i < bases.length; i++)
					{
						switch (bases[i]) {
							case "1":
								base1st = baseOn;
								break;
							case "2":
								base2nd = baseOn;
								break;
							case "3":
								base3rd = baseOn;
								break;
						}
					}
				}
				else if (status == "FINAL" || status == "GAME_OVER")
				{
					inningNum = "F";
					clear();
				}

				else if (status == "PRE_GAME")
				{
					inningNum = "-";
					clear();

				}

				//scores:
				scoreAwayNum = scoreAway;
				scoreHomeNum = scoreHome;

				//redraw the field with the correct values;
				drawField();
			}
			else
			{
				//game was not found - kill the interval
				clearInterval(intervalID);
			}
		}
	}
};


function clear() {
	out1 = outsOff;
	out2 = outsOff;
	base1st = baseOff;
	base2nd = baseOff;
	base3rd = baseOff;
	innTop = innOff;
	innBot = innOff;
	clearInterval(intervalID);
}