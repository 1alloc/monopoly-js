(function() {
	"use strict";
	
	var Player = require('./player');
	var Board = require('./board');
	
	var testData = require('./test-data');
	
	describe('A player', function () {
		var players;
		
		beforeEach(function () {
			players = Player.newPlayers(testData.playersConfiguration());
		});
		
		it('starts at position 0', function () {
			expect(players[0].position()).to.eql(0);
		});
		
		it('starts with 1500$', function () {
			expect(players[0].money()).to.eql(1500);
		});
		
		it('starts with an empty list of properties', function () {
			expect(players[0].properties()).to.eql([]);
		});
		
		it('wraps around the board when moving past the end', function () {
			var movedPlayer = players[0].move([0,40]);
			
			expect(movedPlayer.position()).to.eql(0);
		});
		
		it('earns 200$ when wrapping around the board', function () {
			var movedPlayer = players[0].move([0,40]);
			
			expect(movedPlayer.money()).to.eql(players[0].money() + 200);
		});
		
		describe('when buying property', function () {
			var PROPERTY = Board.properties().mediterranean;
			var newPlayer;
			
			beforeEach(function () {
				newPlayer = players[0].buyProperty(PROPERTY);
			});
			
			it('substract the price', function () {
				expect(newPlayer.money()).to.eql(players[0].money() - PROPERTY.price());
			});
			
			it('insert them in order', function () {
				expect(newPlayer.properties()[0].equals(PROPERTY)).to.be(true);
				
				newPlayer = newPlayer.buyProperty(Board.properties().shortRailroad);
				
				expect(newPlayer.properties()[0].equals(PROPERTY)).to.be(true);
				expect(newPlayer.properties()[1].equals(Board.properties().shortRailroad)).to.be(true);
				
				newPlayer = newPlayer.buyProperty(Board.properties().broadwalk);
				
				expect(newPlayer.properties()[0].equals(PROPERTY)).to.be(true);
				expect(newPlayer.properties()[1].equals(Board.properties().broadwalk)).to.be(true);
				expect(newPlayer.properties()[2].equals(Board.properties().shortRailroad)).to.be(true);
				
				newPlayer = newPlayer.buyProperty(Board.properties().connecticut);
				
				expect(newPlayer.properties()[0].equals(PROPERTY)).to.be(true);
				expect(newPlayer.properties()[1].equals(Board.properties().connecticut)).to.be(true);
				expect(newPlayer.properties()[2].equals(Board.properties().broadwalk)).to.be(true);
				expect(newPlayer.properties()[3].equals(Board.properties().shortRailroad)).to.be(true);
			});
		});
		
		it('substracts the money when paying it', function () {
			var amount = 100;
			var newPlayer = players[0].pay(amount);
			
			expect(newPlayer.money()).to.eql(1500 - amount);
		});
		
		it('cannot pay enough money to fall at 0', function () {
			var amount = 1500;
			
			var pay = function () {
				players[0].pay(amount);
			};
			
			expect(pay).to.throwError();
		});
		
		it('adds the money when earning it', function () {
			var amount = 100;
			var newPlayer = players[0].earn(amount);
			
			expect(newPlayer.money()).to.eql(1500 + amount);
		});
	});
}());