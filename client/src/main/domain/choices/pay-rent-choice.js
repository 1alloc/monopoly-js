(function() {
	"use strict";
	
	var i18n = require('./i18n').i18n();
	var precondition = require('./contract').precondition;
	
	var Player = require('./player');
	
	exports.newChoice = function (rent, toPlayer) {
		precondition(_.isNumber(rent) && rent > 0, 'Pay rent choice requires a rent greater than 0');
		precondition(toPlayer && Player.isPlayer(toPlayer),
			'Pay rent choice requires the player to pay to');
		
		return new PayRentChoice(rent, toPlayer.id(), toPlayer.name());
	};
	
	function PayRentChoice(rent, toPlayerId, toPlayerName) {
		this.id = 'pay-rent';
		this.name = i18n.CHOICE_PAY_RENT.replace('{rent}', i18n.formatPrice(rent)).replace('{toPlayer}', toPlayerName);
		this._rent = rent;
		this._toPlayerId = toPlayerId;
		this._toPlayerName = toPlayerName;
	}
	
	PayRentChoice.prototype.equals = function (other) {
		if (!(other instanceof PayRentChoice)) {
			return false;
		}
		
		var self = this;
		return other.match({
			'pay-rent': function (rent, toPlayerId, _) {
				return self._rent === rent && self._toPlayerId === toPlayerId;
			}
		});
	};
	
	PayRentChoice.prototype.match = function (visitor) {
		return visitor[this.id](this._rent, this._toPlayerId, this._toPlayerName);
	};
}());