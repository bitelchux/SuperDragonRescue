'use strict';

var Player = require('./player');
var Viewport = require('./viewport');
var Platform = require('./platform');
var Block = require('./block');
var Monster = require('./blobmonster');
var Princess = require('./princess');
var Knight = require('./knight');

function Level( number, game, dud ) {

	this.number = number;
	this.player = null;
	this.dud = dud;

/*
 *  T - tile T (a-z)
 *  Capital letter: flip (lowercase) tile horizontally
 */

// this data compresses really well :)
this.data = [
// level 1 - setup to force certain concepts
'..........................................*....................................................................................................nL....VcUucv.......................................................................2nN............Ghhhg.....Tt..................n2nKLN....................888.........................Ghhhg..]..................Tt.................Immmmmmi...................444................................Ln$................Tt....$.nKL]n$....IJsoooooji.....+++..........464.....nn1.......................Immg................TtN...Ghhhhhhg$nlIJsbbbbbboji.LnN.NNlk$.......444....Ghhhg........+............IJso................Immmg..........GmmJswaaaaaaeojmmmmmmmmmi.......444NN~...............N..........IJsbblkn.......N....IJsoo............ooowa*aaaaaaeoooooooooob2......464mmmi.NKLn........Imi........IJsbbbmmmg....GmmmilIJsbbb...........Ibbbaaaaaaaaaaaaaaaaaaaaa22.....4!4ooojmmmmmg$lnnNKIJsji......IJsbbbbooon.L...ooojmJsbbbbn-.nn.KLn.IJbbbyaaaaaa(aaaaaaaaaaaaa222.N.Immmbbboooooo.GmmmmmJsboji-nkLIJsbbbbbbbbmmmg..bbbooobbbbbmmmmmmmmmmJsbbbbbbbbbbbyaazbbyaaaaazmmmmmmJsoobbbbbbbbbffoooooobbbojmmmmJsbbbbbbbbboooFFFbbbbbbbbbbbooooooooooobbbbbbbbbbbbbbbbbbbbbbbbbbbbbboobbb0',
// more platforming, with a simple puzzle
'..............................................&&&............................GJsbbbbbbbbbbbbbbbbbbbb..............................................&&&.............................sbbwaaaaaaaaaebbbbbbbb...........*..................................&&&.............................bbwa$aaaaaaaaaaebbbbbb.........................................777..&&&.............................bwaaaaaa09aaaaaaebbbbb..........$..(...$.@.....................333.+&&&..777.........................aaaaaaabbyaaaaaabbbbb...........VcUucv..Xdx.$...]$............353..&&&..333......................n..aaaaaaabbbyaaaaaebbbb.............Tt.........VUuv............n3%3NI&&&i.353.........*...........Imi.aaaaaaabbbbyaaaaa444b.............Tt..........Tt............ImmmmmJ&&&ji3^3....................IJojmmaaaaaaebbbbyaaaa444b.............Tt......1...Tt..kL.......IJsooooo&&&ojmmmmg.................IJsboooaa#aaaabbbbbyaaa464b.~n.lkn..1+n.Tt.N.n-11..NTtnImmi)$$nLIJsbbbbbb&&&booooo.................IJsbbbbbaaXdxaabbbbbby094!4bmmmmmmmmmmmmmmMMMMMMMMMMMMMMJsojmgGmmJsbbbbbbb&&&bb[...................GJsbbbbbbaaaaaaabbbbbbbbbbbbbooooooooobbbboooooooooooooooobboofFooobbbbbbbb&&&bbfffffffffffffffffffffobbbbbbwaa$aaaaebbbbbbbbbbbb0',
// cave level
'....ImmmJBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBSjmi........i.~.BBBBBBEaaaaaaaaaaWBBBBBBBBBBBBBBBBEaaaaaaaaaWBBBBEaaaaWBEaaaaaAAaaaaaaaaaaWBBBBBBBBBBOOE........BAAAWBBBBEaaaaaaaaaaaaBBBBBBBBBBBBBEaaaaaa}09aaaaWBBBa{aaaaaaaaaaaAAaaaaaaaaaaaWBBBBBBBEaaaa........BAAAAWBBEaaaaaa$-09a$aWBBBBBBBBBBEaaaaa}aYBBBBZaaaBBBZaaaaaaa1090$$Aaaaaa09a}aaaaWBBBBEaaaaa.....888BAAAAAaaaaaaaaazbbbbyaaWBEaaWBBBEaaa90YBBBBBBBBZaaWBBBZ0a09aYBBBBZAAaaaYBBBBBZaaaaaaaaaaaaaa.....444BAAAAAaaaaaaaaaebbbbwaaaaaaaaaaaaa0YBBBBBBBBBBBBZaaBBBBBBBBBBBBBBEAAaaaBBBBBBBaaaaaaaaaaaaaa.....464BAAAAAaaaaaaaaaaaaaaaaaaaaaaaaaaaYBBBBBBEaaaaWBBBaaBBBBBBBBBEaaaaaAAaaaBBBBBBBZ9aaaaaaaaaaaaN....444BAAAAAaaaaaaaaaaaaaaaaaaaaaa$09YBBBBBEaaaaaaaaWBEaaBBBBEaaaaaaaaaaAAaaaBBBBBBBBBaaaaaaaaaa0Ymi...444BZAAAAaa90aaaaaaaaaaaaa09aaaYBBBBBBBBa*aaaa0aaaaaaaWBEaaaaaaa$0aaaAAaaaBBBBBBBBEaaaaaaaaaYBBSji..464BBZAAAaYBBZa)aaaaaaaaaYBBZ$aBBBBBBBBBaaaaaYBZaaaaaaaaaaa0a09YBBZaa#AaaaWBBBBBBEaaa@aaaaaYBBBBSji.4!4BBBZaYBBBBBBBBZa09a{aYBBBBaaBBBBBBBBBZ09YBBBBZaa+aa09aYBBBBBBBBBZaXdxaaaBBBBBBaaaaXxaaa$BBBBBBSjMmmmBBBBBBBBBBBBBBBBBBBBBBBBBEaaWBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBa$AaaaaWBBBBEaaaaaaaaaaWBBBBBBOOOOO0',
// toadstool level
'.............................................................................................................................$...............................................*................888...888.888.................................................@...............$..+.$................444...444.444...............................$.(..$.....VcUucv$Xx.....$.....Xx$VcUucv................464...464.464.......VcUucv..................VcUuCv.......Tt.....................Tt..................444...444.444.........Tt.............VUuv.....Tt.........Tt.....................Tt..................444888444.444.........Tt..............Tt......Tt.........Tt.....................Tt...........VUuv...444444444.464....VUuv.Tt..............Tt......Tt.........Tt.....................Tt............Tt....444464444.4a4~n...Tt..Tt....$...]$#...Tt......Tt.........Tt.....................Tt.$..(...$...Tt....4444!4444Nmmmmmi..Tt..Tt....VCUucvXdx.Tt......Tt.........Tt..$......].$.........Tt.VccUuCCv...Tt...ImmmmmmmmmmOOOOSj..Tt..Tt......Tt......TtVcUucvTt...VcUucvTt..VcccUuCCCv.....VUuvTt....Tt......Tt...JsoooooooooBBBBBS..Tt..Tt......Tt...$..Tt..Tt..TtVUuv.Tt..Tt......Tt...VUuv...Tt.Tt....Tt......Tt...sbbbbbbbbbb0',
// castle 1
'bbbbbbbbbbbbbbBBBBbbbbbBbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbgttttttttttvttGbgttttttGbgtttVttttttttttttttttVtttttttttVtttGbgtttVtttttttVtttttttt3333333GbbbbPbbbbg..........d..Gbg.....*Gbg...D................D.........D...Gbg...D.......D........3333333Gbbbbbbbbbg..........d..GPg......ttt...D................D.........D...Gbg...D.......D........3p353p3Gtttttttvtt..........d..Gbg............C................C.........C...Gbg...D.......D........333!333G.......d............d..ttt.........IHhhF.........@....fHF.......fhF..Gbg.2.D.......D.......fhhhhhhhb.......d............d.............IJbbPg.........XWx..GbgYYYYYYYGbg..GbbhhhhF......D.......tEtEtEttG.......d............c.{..........IJbbbbg...$.1..).$...GbgZZZZZZZGbg..GbgTTTET......D........D.D.D..G.......d...........IhhHi.l..$.@..Gbbbbbg....fhhhhF....GbgZZZZZZZGbg..TTT...D.......D........D.D.D..G.......c.N..)l.$..IJBPbjhhhF..Xx.Gbbbbbg....tETTEt....GbgZZZZZZZGbg........D.......D........D.D.D..G.~..IHHHHHHHHF..fhJBBBbbbbbgyyyyyGbbbbbg.....D..D.....GbgZZZZZZZGbg........C}.}.1..C........C.C.C1IJHHHHJBBBBBBBBgyyGbBBBBbbbbbgZZZZZGbbbbbgYYYYYYYYYYYYYYGbgZZZZZZZGbgMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMhJb1',
// endboss - had to be short coz princess is active from start.
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb..................................TTTTVTTTTTTT333GbbbbgttttVttttttVtttVttGbgtTTTVtTTTTVTTTGbbbbbbbbb......................................D.......333Gbbbbg....D......D...D..Gbg....D.....D...Gbbbbbbbbb......................................D.......353Gbbbbg1...D......D...D..Gbg....D.....D...Gbbbbbbbbb......................................D.....)L3%3Gbbbbg12..D......D...D..Gbg....D.....D...Gbbbbbbbbb......................................D......&&&&Gbbbbg&&&.D......D...D..Gbg....D.....D...Gbbbbbbbbb......................................D....l&&&&&Gbbbbg333.D&.....D...D..Gbg....D.....D...Gbbbbbbbbb......................................D....&&&&&&Gbbbbg333.D......D...D..AAA....D.....D...Gbbbbbbbbb......................................D...&&&&&&&Gbbbbg333&D......D...D..AAA....C..U..C...Gbbbbbbbbb......................................D..&&&&&&&&Gbbbbg353.D...$..C.u.Cl$AAA....&&&&&&&...Gbbbbbbbbb...................................~.nC.&&&&&&&&&Gbbbbg3^3.CL..n&&&&&&&&&AAA...&&&&&&&&&..Gbbbbbbbbb..................................hhhhhhhhhhhhhhhBbbbbbmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmbbbbbbbbbb..................................1'
];

	this.parent = game;
	this.height = 12;
	this.width = 0;
	this.tilesize = 16;
	this.scale = 4;
	this.tileset = 0;

	if ( dud ) {
		// pick a random level to scroll in background
		this.number = this.rand(0, this.data.length - 1);
	}

	this.setup();
	this.init( this.buffers[0], false );
	this.init( this.buffers[1], true );
};

Level.prototype = {
	rand: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
    },
	genBG: function( t, w, h ) {

		if ( this.tileset === 1) {
			// 9  - small window
			// 14 - halfbrick
			// 15 - single candle
			// 16 - triple candle
			// 17 + 18 tall window
			var bricks = [ 10, 15, 16, 17 ];
			var xr = 0;
			var yr = 0;
			// scatter some of these half bricks
			for (var r = 0; r < 100; r++) {
				xr = this.rand(0, w - 1);
				yr = this.rand(0, h - 1);
				t[xr][yr] = 14;
			}
			// row of stuff
			yr = 5;
			for (xr = this.rand(5, 8); xr < w; xr += this.rand(4, 7)) {
				var b = this.rand(0, 3);
				yr = this.rand(3, 5);
				t[xr][yr] = bricks[b];
				if ( b === 3) {
					t[xr][yr + 1] = bricks[b] + 1;
				}
			}
		} else {
			// a = 0
			// p = 15
			// q = 16
			// r = 17
			// P = -17
			// Q = -16

			/* .   Q    .
			 * r - P or q     up or down
			 * a   a    p
			 *
			 * .   .    Q    .
			 * Q - r or P or q
			 * P   a    a    p
			 * a
			 *
			 * .   .    .     .
			 * q - . or . or  Q
			 * p   r    q     P
			 *     a    p     a
			 *          a
			 *
			 */

			var p = [
							[ 17, 0 ],    // r a
							[ -16, -17 ], // Q P,
							[ 16, 15 ]    // q p,
						  ];

			var r = [
				[ 1,1,  2,0 ],       // ra -> QP -1 or qp 0
				[ 0,0 , 1, 1, 2,0 ], // QP -> ra 0 or QP -1 or qp 0
				[ 0,-1, 2,-1, 1,0 ]  // qp -> ra -1, qp -1, QP 0
			];
			var cp = 0;
			var i = 0;
			var y = this.rand(4, 8);
			for (var z = 0; z < w; z++ ) {

				t[z][y] = p[cp][0];
				t[z][y + 1] = p[cp][1];

				// fill all spaces below with 0's
				for (var az = y + 2; az < this.height; az++ ) {
					t[z][az] = 0;
				}

				// make sure the tree line stays on the screen
				if ( y > 9 ) {
					// too low
					var temp = -1;
					while ( temp < 0 ) {
						i = this.rand(0, (r[cp].length / 2 ) - 1) * 2;
						temp = r[cp][i + 1];
					}
					y -= r[cp][i + 1];
					cp = r[cp][i];
				} else if ( y < 2 ) {
					// too high
					var temp = 1;
					while ( temp > 0 ) {
						i = this.rand(0, (r[cp].length / 2 ) - 1) * 2;
						temp = r[cp][i + 1];
					}
					y -= r[cp][i + 1];
					cp = r[cp][i];
				} else {
					i = this.rand(0, (r[cp].length / 2 ) - 1) * 2;
					y -= r[cp][i + 1];
					cp = r[cp][i];
				}
			}
		}
	},
	genBlockers: function( t, w, h ) {
		this.blockers = [];
		var s = this.tilesize * this.scale;

		// [ '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '[', ']', '{', '}', '1', '2' ];
		/*
		 * 29 ~ player
		 *    ! exit
		 *    @ plat_right
		 *    # plat_left
		 *    $ plat_down
		 *    % plat_up
		 *    ^ monsterb
		 * -59 & monsterb
		 * -55 * chilli
		 *     (  m1_r
		 * -56 )  m1_l
		 * -52 -  m2_r
		 * -54 +  m2_l
		 *     [ m3_r
		 *     ] m3_l
		 *     { m4_r
		 *     } m4_l
		 *     1 barrel
		 *     2 crate
		 */

		var stuff = {
			'player': [ '~' ],
			'exit': [ '!', '%', '^' ],
			'blob': [ '-', '+', '(', ')' ],
			'gblob': [ '(', ')' ],
			'lblob': [ ')', '+' ],
			'turt': [ '[', ']', '{', '}' ],
			'bturt': [ '{', '}' ],
			'lturt': [ ']', '}' ],
			'items': [ '1', '2' ],
			'chilli': [ '*' ],
			'monsterblock': [ '$' ],
			'ignore': [ '3', '4', '5', '6', '7', '8', '9', '0', '@', '#' ] // castle blocks && stalactites
		};

		// one for each tile set
		var rules = [
			/*
			* -32 0  forest block
			* -31 1  ground block
			* -30 2  mushroom extend
			* -29 3  cloud center
			* -28 4  cave ceiling slope
			* -27 5  spikes
			* -26 6  grass platform end
			* -25 7  grass float flat
			* -24 8  grass triangle slope
			* -23 9  grass triangle block
			* -22 10  big mushroom
			* -21 11  little mushroom
			* -20 12  grass block
			* -19 13  grass blades
			* -18 14  ground block shadow
			* -17 15  forest
			* -16 16  forest
			* -15 17  forest
			* -14 18  ground block slope
			* -13 19  mushroom stilt
			* -12 20  mushroom center
			* -11 21  mushroom end
			* -10 22  cave ceiling slope
			* -9  23  cloud end
			* -8  24  ground slope left
			* -7  25  ground slope right
			*/
			{
				't_l': [ -24, -8, 25 ],
				't_r': [ 8, -7, 24 ],
				'ign': [ 6, -26, 10, -22, 11, -21, -13, 19, -19, 13, -32, 0  ],
				'half': [ 7, -25, -11, 21, -12, 20, -30, 2, -28, 4, -10, 22 ],
				'plat': [ -29, 3, -9, 23 ],
				'dead': [ 5, -27 ],
				'item': [],
				'boss': [], // princess boss
				'kni': [], // knight
				'door': [],
				'merge': [ -20, 12, -18, 14, -31, 1, -12, 20, -11, 21, -30, 2, -25, 7, -59 ]
			},
			/*
			* -32 0  blue brick block
			* -31 1  grey brick block
			* -30 2  column base
			* -29 3  column
			* -28 4  column top
			* -27 5  corner brick
			* -26 6  edge brick
			* -25 7  edge floor
			* -24 8  slope
			* -23 9  slope brick
			* -22 10  blue window
			* -21 11  skeleton
			* -20 12  tile floor
			* -19 13  skull
			* -18 14  half blue brick
			* -17 15  candle
			* -16 16  candle
			* -15 17  blue window top
			* -14 18  blue window bottom
			* -13 19  edge
			* -12 20  edge end
			* -11 21  column top
			* -10 22  platform center
			* -9  23  platform end
			* -8  24  lava top
			* -7  25  lava block
			*/
			{
				't_l': [ -24 ],
				't_r': [ 8 ],
				'ign': [ -21, 11, -19, 13, -30, 2, -29, 3, -17, 15, -16, 16 ],
				'half': [ -13, 19, -11, 21 ],
				'plat': [ -10, 22, -9,  23 ],
				'dead': [ -7, 25, -8,  24 ],
				'item': [],
				'boss': [ 20 ], // princess boss
				'kni': [ -12 ], // knight
				'door': [ -32 ],
				'merge': [ -31, 1, -27, 5, -26, 6, -25, 7, -23, 9, -20, 12, -59 ]
			}
		];

		var empties = [];

		var r = rules[this.tileset];
		var f = stuff;

		for (var y = 0; y < h; y++ ) {
			for (var x = 0; x < w; x++ ) {
				var z = t[x][y];
				var tc = String.fromCharCode( z + 97);
				if ( z !== -51 ) {

					var block = new Block( x * s, y * s, s, s );
					var ign = false;

					if ( this.io( f.player, tc ) ) { // player start tile
						ign = true;
						this.player = new Player( this.parent, x * s, y * s, this.viewport );
						t[x][y] = -51;
						this.chkCave( t, x, y);
					}
					if ( this.io( f.monsterblock, tc ) ) { // monster blocker
						block.mb = true;
						ign = false;
						this.chkCave( t, x, y);
					}
					if ( this.io( f.items, tc ) ) { // crates and barrels
						ign = true;
						var monster = new Monster( this, x * s, y * s, false, ( tc === '1'? 2 : 3 ) );
						// monster.mb = true;
						this.things.push( monster );
						this.blockers.push( monster );
						t[x][y] = -51;
						this.chkCave( t, x, y);
					}
					if ( this.io( f.blob, tc ) ) { // blob monster
						ign = true;
						var monster = new Monster( this, x * s, y * s, this.io( f.gblob, tc ), 0 );
						monster.goingLeft = this.io( f.lblob, tc );
						this.things.push( monster );
						this.blockers.push( monster );
						t[x][y] = -51;
						this.chkCave( t, x, y);
					}
					if ( this.io( r.boss, z ) ) { // princess
						ign = true;
						var p = new Princess( this, x * s, y * s );
						this.things.push( p );
						this.blockers.push( p );
						t[x][y] = -51;
					}
					if ( this.io( r.kni, z ) ) { // endgame knight
						ign = true;
						var p = new Knight( this, x * s, (y * s) - 44, 0 ); // knight
						this.things.push( p );
						this.blockers.push( p );
						t[x][y] = -51;
					}
					if ( this.io( f.chilli, tc ) ) { // chilli bonus
						var p = new Knight( this, x * s, y * s, 2 ); // chilli
						this.things.push( p );
						this.blockers.push( p );
						t[x][y] = -51;
						this.chkCave( t, x, y);
						ign = true;
					}
					if ( this.io( f.turt, tc ) ) { // turtles
						ign = true;
						var monster = new Monster( this, x * s, y * s, this.io( f.bturt, tc ), 1 );
						monster.goingLeft = this.io( f.lturt, tc );
						this.things.push( monster );
						this.blockers.push( monster );
						t[x][y] = -51;
						this.chkCave( t, x, y);
					}
					if ( this.io( f.ignore, tc ) ) { // ignore these blocks
						ign = true;
					}
					if ( this.io( f.exit, tc ) ) { // exit block - three diff types
						if ( tc === '%' ) {
							block.next = true;
						} else if ( tc === '^' ) {
							block.dest = true;
						} else {
							block.exit = true;
						}
					}
					if ( this.io( r.door, z ) ) { // door
						var p = new Knight( this, x * s, y * s, 1 ); // wall
						this.things.push( p );
						this.blockers.push( p );
						t[x][y] = -51; // purple bricks
						ign = true;
					}
					if ( this.io( r.plat, z ) ) { // platforms
						var startX = x * s;
						var startY = y * s;
						var p = x;
						var pz = t[p][y];
						var up = false;
						var db = String.fromCharCode( t[p][y-1] + 97);
						if ( db === '#' || db === '@' ) {
							t[x][y - 1] = -51;
							this.chkCave( t, x, y - 1);
							if ( db === '#' ) up = true;
						}
						while ( this.io( r.plat, pz )) {
							t[p][y] = -51;
							this.chkCave( t, p, y);
							p++;
							pz = t[p][y];
						}

						var pbuf = { b: null, c: null };

						this.createImage( (p * s) - startX, s, pbuf );

						var platform = new Platform( this, pbuf, (p * s) - startX, s / 2, startX, startY, up );
						platform.init( this.tileset, this.tilesize, this.tilesize * this.scale, p - x );
						this.things.push( platform );
						this.blockers.push( platform );
						ign = true;
					}

					if ( this.io( r.t_l,  z ) ) { // slope
						block.tr = true;
						// add block underneath slope to empties so that slopes work nicely
						empties.push( [ x, y + 1 ] );
					} else if ( this.io( r.t_r, z ) ) { // slope
						block.tl = true;
						// add block underneath slope to empties so that slopes work nicely
						empties.push( [ x, y + 1 ] );

					} else if ( this.io( r.half, z ) ) { // halfheight blocks
						block.height = s / 2;
					} else if ( this.io( r.ign, z ) ) { // ignore these blocks
						ign = true;
					} else if ( this.io( r.dead, z ) ) { // deadly blocks
						block.kill = true;
						block.y += s / 2;
						block.height = s / 2;

						// combine 'kill' blocks into one big one
						var startX = x * s;
						var p = x + 1;
						var pz = t[p][y];
						while ( this.io( r.dead, pz )) {
							empties.push( [ p, y ] );
							this.chkCave( t, p, y);
							p++;
							pz = t[p][y];

						}
						block.width = (p * s) - startX;
					}

					// filter out blocks marked as ignore
					for (var e = 0; e < empties.length; e++ ) {
						if ( empties[e][0] === x && empties[e][1] === y ) {
							ign = true;
						}
					}

					if ( !ign ) {
						// this merges similar blocks together into one big block - improves monster movement and reduces collision detection
						if ( this.io( r.merge, z ) && x < (w - 1) ) {
							// empties.push( [ p, y ] );
							var startX = x * s;
							var p = x;
							var pz = t[p][y];
							var br = false;
							// not that this is skipping potential ignore flags :o
							while ( this.io( r.merge, pz ) && p < (w - 1) ) {
								empties.push( [ p, y ] );
								p++;
								pz = t[p][y];
							}

							block.width = (p * s) - startX;
							//block.c = 'yellow';
						} else {
							//block.c = 'red';
						}

						this.blockers.push( block );

					}
				}
			}
		}

		this.player.boxes = this.blockers;

		// pass the blockers on to the monsters - do this after we have created all the blockers
		for (var m = 0; m < this.things.length; m++) {
			var mo = this.things[m];
			if ( mo.isMonster && !mo.isKnight && !mo.pickup) {
				mo.blo = this.blockers.filter( mo.blockfilter, mo );
			}
		}
	},
	// check if a tile is surrounded by darkblue tiles - as used in the cave level, if so, filler is dark blue 'cave' tile
	chkCave: function( t, x, y ) {
		if ( t[x - 1][y] === 0 || t[x + 1][y] === 0 || t[x][y - 1] === 0 ) {
			t[x][y] = 0;
		}
	},
	init: function( b, flag ) {
		// init the viewport
		this.viewport = new Viewport( this.parent.gameSize );

		// convert the tilemap into something that is easy to render
		var tilemap = [];

		this.tileset = parseInt(this.data[this.number][this.data[this.number].length - 1],10);

		// empty tilemap
		this.emptyTilemap( tilemap, b.w, this.height, this.tileset - 1 );
		// convert ascii characters to tilemap numbers
		if ( flag ) {
			// get data from pre defined array
			this.convertTilemap( tilemap, this.data[this.number], b.w );
			this.genBlockers( tilemap, b.w, this.height );
		} else {
			// generate random background
			this.genBG( tilemap, b.w, this.height );
		}
		// we're going to draw the whole tilemap on an image so we only have to render that one image once and not 300+ little ones.
		// create a buffer canvas
		this.createImage( (b.w * this.tilesize * this.scale), this.parent.gameSize.height, b );
		this.drawTileMap( b.c, tilemap, this.height, b.w );
	},
	update: function() {
		if ( !this.dud ) {
			this.player.update();
		}

		var pl = this.things.filter( this.viewport.vis, this.viewport );
		for (var i = 0; i < pl.length; i++ ) {
			pl[i].update();
		}
	},
	render: function( c ) {

		for ( var b = 0; b < this.buffers.length; b++ ) {
			if ( this.buffers[b].b !== null ) {
				c.drawImage(this.buffers[b].b, Math.floor(this.buffers[b].xo), 0, c.canvas.width, c.canvas.height, 0, 0, c.canvas.width, c.canvas.height);
			}
		}

		if ( !this.dud ) {
			var i = 0;
			var pl = this.things.filter( this.viewport.vis, this.viewport );
			for (i = 0; i < pl.length; i++ ) {
				pl[i].render( c, Math.floor(this.viewport.x) );
			}

			this.player.render(c, Math.floor(this.buffers[1].xo));
		}
	},
	drawTile: function( c, t, x, y, flip, to ) {

		if ( t < 0 ) {
			return;
		}

		var p = this.tilesize * this.scale, ts = this.tileset;
		if ( to > -1 ) {
			ts = to;
		}

		if ( flip ) {
			c.save();
            c.translate(c.canvas.width, 0);
            c.scale(-1, 1);
            c.drawImage(	this.parent.images[0],
							t * this.tilesize, // spritesheet offset
							ts * this.tilesize,
							this.tilesize,     // tilesize on spritesheet
							this.tilesize,
							// secret sauce: change the destination's X registration point
							(c.canvas.width - (x * p) - (p)),
							y * p,
							p,
							p);
            c.restore();
		} else {
			c.drawImage( this.parent.images[0],
			   t * this.tilesize, // spritesheet offset
			   ts * this.tilesize,
			   this.tilesize,     // tilesize on spritesheet
			   this.tilesize,
			   x * p, // location on screen
			   y * p,
			   p,     // scale the tile dimensions
			   p);
		}
	},
	createImage: function(w,h,b) {
		var bf = document.createElement('canvas');
		bf.width = w;
		bf.height = h;
		var bc = bf.getContext('2d');
		// Don't you dare AntiAlias the pixelart!
		bc.imageSmoothingEnabled = bc.mozImageSmoothingEnabled = bc.oImageSmoothingEnabled = false;
		b.b = bf;
		b.c = bc;
	},
	move: function( d ) {
		this.buffers[1].xo += d;
		this.buffers[0].xo += d / 2;
	},
	emptyTilemap: function( tilemap, width, height, c ) {
		for (var w = 0; w < width; w++) {
			tilemap[w] = [];
			for (var h = 0; h < height; h++) {
				tilemap[w].push( c );
			}
		}
	},
	convertTilemap: function( tilemap, data, width ) {
		var x = 0, y = 0;
		for (var i = 0; i < data.length; i++ ) {
			tilemap[x][y] = (data[i].charCodeAt() - 97);
			x++;
			if ( x > (width - 1) ) {
				x = 0, y++;
			}
		}
	},
	drawTileMap: function( ctx, tilemap, h, w ) {
		var sp1 = [ '4', '6', '8' ], sp2 = [ '3', '5', '7' ], ex = [ '!', '%', '^' ], e2 = [ '&', '9', '0' ], flip = false, ts = -1;
		for (var y = 0; y < h; y++ ) {
			for (var x = 0; x < w; x++ ) {
				var z = String.fromCharCode( tilemap[x][y] + 97 );
				flip = false;
				if ( tilemap[x][y] < -6) {
					tilemap[x][y] += 32;
					flip = true;
				}

				/* '2' - 3 - -15    3
				 * '4' - 4 - -13    5
				 * '6' - 5 - -11    7
				 * '8' - 6 -  -9    9
				 *
				 * '1' - 3 - -16    3
				 * '3' - 4 - -14    5
				 * '5' - 5 - -12    7
				 * '7' - 6 - -10    9
				 *
				 *  '9' -
				 *  '0' -
				 */

				if ( this.io( sp1, z ) ) {
					//console.log( ' 1 - ' + tilemap[x][y] + ' z '  +  z + '  -> ' + ((z / 2) + 2));
					ts = 2;
					tilemap[x][y] = (parseInt(z,10) / 2) + 2 ;
					flip = false;
				}
				if ( this.io( sp2, z ) ) {
					// console.log( ' 2 - ' + tilemap[x][y]  + ' z '  +  (z + 1) + '  -> ' + (((z + 1) / 2) + 2) );
					ts = 3;
					tilemap[x][y] = ((parseInt(z,10) + 1) / 2) + 2 ;
					flip = false;
				}
				if ( this.io( ex, z ) ) {
					tilemap[x][y] = 0; // blue square for exit
					ts = 0;
				}
				// stalactites
				if ( this.io( e2, z ) ) {
					// console.log( z , tilemap[x][y] );
					ts = 2;
					tilemap[x][y] = 14;
					flip = false;
					if ( z === '&' ) {
						tilemap[x][y] = 15;
					}
					if ( z === '0' ) {
						ts = 3;
					}

				}
				this.drawTile( ctx, tilemap[x][y], x, y, flip, ts);
				ts = -1;
			}
		}
	},
	// shorthand function
	io: function(a, c) {
		return a.indexOf(c) > -1;
	},
	// go to the next level
	next: function(p) {
		this.number++;

		if ( this.number > (this.data.length - 1) ) {
			this.number = 0;
		}

		this.bl();
		if ( p ) {
			this.player.lives = p.lives;
			this.player.chi = p.chi;
		}
	},
	bl: function() {
		this.setup();
		this.init( this.buffers[0], false );
		this.init( this.buffers[1], true );
	},
	restart: function(p) {
		this.bl();
		this.player.lives = p.lives;
		this.player.chi = 0;
	},
	setup: function() {
		this.buffers = [
						{
							'b': null,
							'c': null,
							'w': 80,
							'xo': 0
						},
						{
							'b': null,
							'c': null,
							'w': 100,
							'xo': 0
						}
					];

		this.width = this.buffers[1].w * this.tilesize * this.scale;
		// clear all these
		// list of collision blocks
		this.blockers = [];
		// list of stuff
		this.things = [];
		// the viewport
		this.viewport = null;
	}
};

module.exports = Level;
