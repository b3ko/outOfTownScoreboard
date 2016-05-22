# out of town scoreboard

Out of town scoreboard will be a physical device that shows one team's score while a game is happening.
It is based off of the [out of town scoreboard at PNC park in pittsburgh] (https://pbs.twimg.com/media/Ci0-QtrVEAECZS2.jpg:large).
Mine will always show the yankee score. I am a yankee fan living in pittsburgh so this is why i have chosen these teams.

The one I am building will be run by an arduino (or compatible).
The Outs, men on base, and inning half(top/bottom) will be LEDS of appropriate color.
The inning and scores will be either 7-segment displays or if i can find a good sized version, it will be a matrix of LEDS which will be more acurate of what is in the scoreboard.

I have had this idea for awhile but couldn't find a good source for the data. Now i have found one and will start to make this.
the other unsolved challenge is the team names.
I can simply have the board say "home" and "away". but it would be nice to have the team names on the board.
option two is to have it say "home/away" and have a "yankee" card i can slide over the appropriate side so it would always say yankees on one side and either home or away on the other.
or we can have cards for every team and the correct cards could be inserted but this seems tedious and the correct teams will never get put in.
last option is some sort of display but that will bring the complexity up too high.
at least there are options.

- to do:
  - ~~logic to get game data~~
  - digital mock up:
	- ~~create field~~
	- ~~"wire" the "leds" up~~
	- ~~add inning and "half" lights~~
	- ~~add score digits~~
	- ~~wire up the innings~~
	- ~~wire up the score~~
	- ~~add drop down for teams~~
	- ~~wire up drop down~~
	- ~~add logic to show game statuses for games not in progress (in the inning box) F = final, P = posponed, D = Delayed, S = Scheduled, etc~~

- to be tested during a game:
	- ~~does the team drop down logic work (seems to be stepping through code)~~
	- ~~does the interval still work now that i moved things around~~ - fixed
	- does the after midnight logic work - day time logic seems to work - needs to be tested after midnight
	- ~~switching bewteen games while games are live?~~fixed
	- ~~switching between live game and a scheduled game, visa-versa.~~

- bug fixes:
	- ~~games go past midnight - adjust date logic so "today's games" goes to 4 in the morning.~~


