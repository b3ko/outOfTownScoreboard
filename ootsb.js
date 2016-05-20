drawField();

getScores();
var intervalID = window.setInterval(getScores, 5000);

 function drawField() {
	var canvas = document.getElementById('diamond');
	var ctx = canvas.getContext('2d');

	ctx.fillStyle = "rgb(250,250,50)";
	ctx.beginPath();
    ctx.moveTo(0,200);
    ctx.lineTo(200,400);
    ctx.lineTo(400,200);
    ctx.lineTo(200,0);
    ctx.fill();

	ctx.fillStyle = "rgb(10,200,50)";
	ctx.beginPath();
    ctx.moveTo(25,200);
    ctx.lineTo(200,375);
    ctx.lineTo(375,200);
    ctx.lineTo(200,25);
    ctx.fill();

    //bases
    ctx.save();
	makeBase(ctx);
	ctx.translate(320,0);
	makeBase(ctx);
	ctx.translate(-160,-160);
	makeBase(ctx);
	ctx.restore();

	//homeplate
	ctx.fillStyle = "rgb(255,255,255)";
 	ctx.beginPath();
    ctx.moveTo(200,400);
    ctx.lineTo(160,360);
    ctx.lineTo(160,330);
    ctx.lineTo(240,330);
    ctx.lineTo(240,360);
    ctx.fill();

    //outs
 	ctx.fillStyle = "rgb(255,0,30)";
	ctx.beginPath();
	ctx.arc(170, 170, 20, 0, 2 * Math.PI);
	ctx.fill();

		ctx.beginPath();
	ctx.arc(230, 170, 20, 0, 2 * Math.PI);
	ctx.fill();


 };

function makeBase (ctx){
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
    ctx.fillStyle = "rgb(0,0,255)";
	ctx.arc(39, 200, 20, 0, 2 * Math.PI);
	ctx.fill();
}


function getScores() {
	var xhttp = new XMLHttpRequest();

	//get today's date and break it into parts
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth() + 1;
	var year = today.getUTCFullYear();

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

	var team = "nya"; //default will be yankees but for web version we can make a pulldown for all teams. this value will go here.

	xhttp.onreadystatechange = function() { //listen for the state change
		if (xhttp.readyState == 4 && xhttp.status == 200)  //wait for ready state and 200.
		{
			xmlDoc = xhttp.responseXML;
			txt = "";
			x = xmlDoc.getElementsByTagName("ig_game"); //grab the game elements

			for (i = 0; i < x.length; i++) //loop through the games until we get the game we want]
			{
				if(x[i].childNodes[1].id.includes(team))
				indx = i; //change this to a while loop?
			}

			if(indx >= 0) { //did we find the team we wanted, if so proceed
				//get all the needed values
				var outs = x[indx].attributes.outs.value;
				var scoreAway = x[indx].children[1].children[0].attributes.R.value;
				var scoreHome = x[indx].children[2].children[0].attributes.R.value;
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

				//build the string ...this will change later, when it is turning pins on and off
				txt += "outs: " + outs + "<br>";
				txt += "Score: " + scoreAway + " : " + scoreHome + "<br>";
				txt += "inning: " + half + inning + "<br>";
				//loop through the bases and add to string
				for(var i = 0; i < bases.length; i++)
				{
					txt += "base:"		+ bases[i] + "<br>";
				}

				//update the html with the data we got.
				document.getElementById("scores").innerHTML = txt;
			}
			else
			{
				//game was not found - kill the interval
				document.getElementById("scores").innerHTML = "no games";
				clearInterval(intervalID);
			}
		}
	}
};