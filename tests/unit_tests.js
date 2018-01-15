var chai = require('chai');
var expect = chai.expect;

var tjbot = require('../run.js');

describe('Convert Phone Number', function() {
  it('getUserPhoneNumber() should convert words to digits', function() {
    var textPhoneNo = 'one two three four five six seven eight nine zero ';
    var digitPhoneNo = tjbot.getUserPhoneNumber(textPhoneNo);
    expect(digitPhoneNo).to.equal('+11234567890');
  });
});

describe('Get Current Standings for Team', function() {
  it('getCurrentStandings() should return teams current place', function() {
    var mlbStandings = [
      { Name: 'Twins', League: 'AL', Division: 'Central' },
      { Name: 'Indians', League: 'AL', Division: 'Central' },
      { Name: 'Tigers', League: 'AL', Division: 'Central' },
      { Name: 'White Sox', League: 'AL', Division: 'Central' },
      { Name: 'Royals', League: 'AL', Division: 'Central' }
      ];
    var standing = tjbot.getCurrentStandings('Minnesota Twins', mlbStandings);
    expect(standing).to.equal('first');
    var standing = tjbot.getCurrentStandings('Detroit Tigers', mlbStandings);
    expect(standing).to.equal('third');
    var standing = tjbot.getCurrentStandings('Kansas City Royals', mlbStandings);
    expect(standing).to.equal('last');
  });
});