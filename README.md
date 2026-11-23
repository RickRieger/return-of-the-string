# Return Of The String — Working With Strings

[![Tests](https://github.com/RickRieger/return-of-the-string/actions/workflows/tests.yml/badge.svg)](https://github.com/RickRieger/return-of-the-string/actions/workflows/tests.yml)

A JavaScript exercise from the **Code Immersives** web development bootcamp in New York City (February 2021). Eight small functions each take a string and return a changed version of it: adding punctuation, picking out characters by position, capitalizing, and pulling initials out of a name. It's the first assignment in the series where the code goes in its own file ([`main.js`](main.js)), separate from the tests ([`main.test.js`](main.test.js)). This repo is my fork of the assignment.

**Skills practiced:** string indexes (`string[0]`), `.length`, `.toUpperCase()`, `.indexOf()`, joining strings, and reusing one function inside another.

**Built with:** JavaScript (Node.js) and Jest 24. There's no web page; the badge above shows whether the tests currently pass on GitHub.

---

## Contents

- [My solution](#my-solution)
- [How each function works](#how-each-function-works)
- [Run the tests](#run-the-tests)
- [How it's verified](#how-its-verified)
- [Cleanup log (November 2026)](#cleanup-log-november-2026)
- [Original assignment (from the instructor)](#original-assignment-from-the-instructor)

---

## My solution

Written on **2021-02-18** (commit *"The the the the that's all folks"*). All 12 of the assignment's tests passed. *(Shown as it is after the 2026 cleanup; see the log below for what changed.)*

```js
function yell(string) {
  return string + '!';
}

function getFirstCharacter(string) {
  return string[0];
}

function getLastCharacter(string) {
  return string[string.length - 1];
}

function getOneCharacter(string, index) {
  return string[index];
}

function getTwoCharacters(string, index1, index2) {
  return string[index1] + string[index2];
}

function makeCapitalized(string) {
  return string.toUpperCase();
}

function yellLouder(string) {
  return makeCapitalized(string) + '!!!';
}

function getInitials(string) {
  let spaceIndex = string.indexOf(' ');
  if (spaceIndex === -1) {
    return string[0] + '.'; // one-word name: only one initial
  }
  return string[0] + '.' + string[spaceIndex + 1] + '.';
}
```

## How each function works

| Function | Example | How |
|---|---|---|
| `yell` | `'hello'` → `'hello!'` | Join `'!'` onto the end with `+`. |
| `getFirstCharacter` | `'Colin'` → `'C'` | Strings are indexed from **0**, so `string[0]` is the first character. |
| `getLastCharacter` | `'end times'` → `'s'` | The last index is always one less than the length: `string[string.length - 1]`. |
| `getOneCharacter` | `('hello there', 8)` → `'e'` | Any number, or expression, can go inside the brackets. |
| `getTwoCharacters` | `('I want a bagel!', 2, 11)` → `'wg'` | Look up two characters and join them. |
| `makeCapitalized` | `'Speed Racer'` → `'SPEED RACER'` | The built-in `.toUpperCase()` method. |
| `yellLouder` | `'hey'` → `'HEY!!!'` | Reuses `makeCapitalized`, then adds `'!!!'`. |
| `getInitials` | `'Herman Melville'` → `'H.M.'` | The first initial is always at index `0`. For the second, `.indexOf(' ')` finds the **position of the first space**, and the next character is the start of the second name. For `'Colin Raymond Jaffe'`, that gives `'C.R.'`, which is what the test expects. |

`getInitials` is the one the instructor called "a bit tough". The key idea is that `string[i]` gives you the character at a position, while `string.indexOf(character)` does the reverse and gives you the position of a character.

## Run the tests

You need [Node.js](https://nodejs.org/).

```bash
git clone https://github.com/RickRieger/return-of-the-string.git
cd return-of-the-string
npm ci
npm run test:ci   # runs all tests once and exits
npm test          # watch mode, as in the original assignment: re-runs on every save
```

Expected result: `Tests: 13 passed, 13 total` (the 12 original tests plus 1 added in the cleanup below).

## How it's verified

[`.github/workflows/tests.yml`](.github/workflows/tests.yml) runs `npm run test:ci` on GitHub Actions after every push, and the badge at the top shows the result. This repo has no web page, so instead of a live site, a passing test run is how it shows it works.

---

## Cleanup log (November 2026)

All changes below were made on **2026-11-23** on the branch `cleanup-and-ci`, checked by running the tests, and merged into `master`. Each is its own commit. Nothing below the assignment's "DON'T CHANGE ANYTHING BELOW" line in `main.js` was edited, and the original tests are unchanged.

### 1. Fixed `getInitials` for one-word names, and added a test

**Why:** when a name has no space, `indexOf(' ')` returns `-1` ("not found"). Adding 1 gave index `0`, so the code read the **first letter twice**: `getInitials('Cher')` returned `'C.C.'`. The original tests only use two- and three-word names, so they never hit this case.

```js
// Before
function getInitials(string){
  let x= string.indexOf(' ') + 1;
  return string[0]+'.'+ string.charAt(x)+'.';
}
// getInitials('Cher') → 'C.C.'

// After
function getInitials(string) {
  let spaceIndex = string.indexOf(' ');
  if (spaceIndex === -1) {
    return string[0] + '.'; // one-word name: only one initial
  }
  return string[0] + '.' + string[spaceIndex + 1] + '.';
}
// getInitials('Cher') → 'C.'
```

Other improvements in the same change: the variable `x` is now named `spaceIndex`, and `.charAt(x)` became `[ ]`, matching how every other function reads characters.

I added [`initials.test.js`](initials.test.js) for one-word names (`'Cher'` → `'C.'`, `'Madonna'` → `'M.'`). I confirmed it **fails on the old code** and passes on the fix.

### 2. Tidied `main.js`

**Why:** uneven formatting (`yell`'s body wasn't indented, no space before `{`, `string[num]+string[num2]`, extra blank lines) and vague parameter names. `yellLouder` also repeated `.toUpperCase()` instead of using `makeCapitalized`, which does exactly that. No behavior changed.

```js
// Before
function getTwoCharacters(string,num,num2){
  return string[num]+string[num2];
}
function yellLouder(string){
  return string.toUpperCase()+'!!!';
}

// After
function getTwoCharacters(string, index1, index2) {
  return string[index1] + string[index2];
}

function yellLouder(string) {
  return makeCapitalized(string) + '!!!';
}
```

Reusing `makeCapitalized` means that if capitalizing ever changes, it only has to change in one place.

### 3. Automatic test runs on GitHub

**Why:** `npm test` runs Jest in *watch mode*, which never exits, so an automated check couldn't use it. I added a run-once command and a GitHub Actions workflow.

```jsonc
// Before (package.json)
"scripts": { "test": "jest --watch-all" }

// After
"scripts": {
  "test": "jest --watch-all",   // unchanged: watch mode while working
  "test:ci": "jest --ci"        // new: run once and exit
}
```

### 4. Rewrote this README section

Added everything above. The instructor's original instructions are below, unchanged.

---

## Original assignment (from the instructor)

*The text below is the assignment README as written by the Code Immersives instructor, unchanged.*

### Return Of The String

### Setup

1. Fork and clone this repository.
2. Navigate into this directory in your terminal.
3. Use `code .` to open the whole directory in Visual Studio Code.
4. In that same directory, run `jest --watch-all` to start testing.

### Workflow

- You'll be working in **`main.js`** this time, NOT `main.test.js`!
- You'll be creating functions according to the specifications given in the tests in `main.test.js`. Check your terminal for feedback on which aspect of the problem you have yet to complete, and read the specifications' actual code implementation for extra help; it makes explicit exactly what outputs are expected given the test inputs.
- You will NOT need to call your own functions, except for testing purposes.
- But now that we're out of the dark dark realm where global variables slither, we won't need to worry about messing things up by manually testing our code, either! Call your own functions as often as you find it helpful, and feel free to leave those tests in there if you find that helpful as well. Testing don't cost a thing.

### Functions to Write:

- `yell` - it takes in a parameter of type String and returns a version where an exclamation point has been added to the end.
- `getFirstCharacter` - it takes in a parameter of type String and returns only the first character from it. Hint: use an index!
- `getLastCharacter` - it takes in a parameter of type String and returns only the last character from it. Hint: there is a property of strings that can tell you how long the string is. Use it!
- `getOneCharacter` - it takes in a parameter of type String and a parameter of type Number and returns the character in the string that's at the index contained in the second parameter. (Check out the tests in `main.test.js` for examples.) Hint: you can put any JavaScript code in the square brackets, and whatever number it resolves to will be the index JS will look up for you.
- `getTwoCharacters` - it takes in a parameter of type String, a parameter of type Number, and a parameter of type Number, and returns _one_ string made up of the character at the first number's index in the string followed by the character at the second number's index in the string.
- `makeCapitalized` - it takes in a parameter of type String and returns a modified version of that string where every character has been capitalized. Hint: there's a method for that! A little research should turn it up for you.
- `yellLouder` - it takes in a parameter of type String and returns a string where each character in the original has been capitalized and there are three exclamation points at the end.
- `getInitials` - it takes in a parameter of type String representing a name and returns one string with the initials, each followed by a period. See the test for examples. Hint: the first name's initials are always in the same place, but since we don't know how long the first name will be, the second initial is harder. But! There's a method that will return to you the **index** at which a **character** is in a string (sort of the reverse of square brackets, which give you the **character** at a given **index**), and the second initial always comes near a very specific character... Good luck on this one, it's a bit tough!
