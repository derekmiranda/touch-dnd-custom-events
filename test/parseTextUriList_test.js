/* eslint-env mocha */
import expect from 'expect.js';
import parseTextUriList from '../src/parseTextUriList';

describe('parseTextUriList', function() {
  it('should parses uris from given text', function() {
    var text = "being\r\n# a comment\ryeah\nwhat\r\n";

    expect(parseTextUriList(text)).to.contain('being');
    expect(parseTextUriList(text)).to.contain('yeah');
    expect(parseTextUriList(text)).to.contain('what');

    expect(parseTextUriList(text)).not.to.contain('a comment');
    expect(parseTextUriList(text)).not.to.contain('\r');
    expect(parseTextUriList(text)).not.to.contain('\n');
    expect(parseTextUriList(text)).not.to.contain('\r\n');
  });
});
