import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const styles = readFileSync(new URL('./MathLiveExample.css', import.meta.url), 'utf8');

test('sizes the MathLive keyboard with supported responsive variables', () => {
    assert.match(styles, /--keycap-height:\s*48px/);
    assert.match(styles, /@media \(max-width:\s*768px\)[\s\S]*--keycap-height:\s*44px/);
    assert.match(styles, /@media \(max-width:\s*520px\)[\s\S]*--keycap-height:\s*42px/);
    assert.match(styles, /--keycap-font-size:\s*16px/);
});

test('leaves MathLive in control of keyboard structure and positioning', () => {
    assert.doesNotMatch(styles, /\.ML__keyboard-toolbar/);
    assert.doesNotMatch(styles, /\.ML__keyboard\s*\{[^}]*position:\s*fixed/is);
    assert.doesNotMatch(styles, /\.ML__keyboard\s*\{[^}]*max-width:\s*100vw/is);
});
