// Extra test added during the 2026 cleanup (not part of the original assignment).
// The original tests only use names with two or three words. With a one-word
// name there is no space, indexOf(' ') returns -1, and the code read the
// first letter twice ("Cher" -> "C.C.").
const { getInitials } = require('./main');

describe('getInitials (one-word name)', () => {
  it('returns a single initial when there is no last name', () => {
    expect(getInitials('Cher')).toBe('C.');
    expect(getInitials('Madonna')).toBe('M.');
  });
});
