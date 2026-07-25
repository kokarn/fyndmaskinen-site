import test from 'node:test';
import assert from 'node:assert/strict';

import getSourceChipStyle from './source-chip-style.js';

const BOLD_FONT_WEIGHT = 700;

test('active source filters have a strong selected treatment', () => {
    const style = getSourceChipStyle(true);

    assert.equal(style.backgroundColor, '#ffffff');
    assert.equal(style.border, '2px solid #087f88');
    assert.equal(style.color, '#073c40');
    assert.equal(style.fontWeight, BOLD_FONT_WEIGHT);
});

test('inactive source filters remain visible but clearly unselected', () => {
    const style = getSourceChipStyle(false);

    assert.equal(style.backgroundColor, '#e7ecef');
    assert.equal(style.border, '2px solid #66757d');
    assert.equal(style.color, '#263238');
    assert.equal(style.opacity, 1);
});
