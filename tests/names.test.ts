import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchPersons, nameWords } from '../src/utils/names.ts';

const people = [
    { _id: 'p1', name: 'Lý Đức,Huy' },
    { _id: 'p2', name: 'Anh,Quốc' },
    { _id: 'p3', name: 'Quốc,Anh' },
    { _id: 'p4', name: 'Ngô,Xuân Thoại', email: 'thoai@example.com' },
];

test('display order and comma-free forms find a Family,Given name', () => {
    assert.deepEqual(matchPersons(people, 'Huy Lý Đức').map((p) => p._id), ['p1']);
    assert.deepEqual(matchPersons(people, 'Lý Đức Huy').map((p) => p._id), ['p1']);
    assert.deepEqual(matchPersons(people, '  huy  LÝ đức ').map((p) => p._id), ['p1']);
    assert.deepEqual(matchPersons(people, 'Xuân Thoại Ngô').map((p) => p._id), ['p4']);
});

test('exact id, name or email wins over word matching', () => {
    assert.deepEqual(matchPersons(people, 'p2').map((p) => p._id), ['p2']);
    assert.deepEqual(matchPersons(people, 'Anh,Quốc').map((p) => p._id), ['p2']);
    assert.deepEqual(matchPersons(people, 'THOAI@example.com').map((p) => p._id), ['p4']);
});

test('several people with the same words are all returned, not guessed', () => {
    assert.deepEqual(matchPersons(people, 'Quốc Anh').map((p) => p._id).sort(), ['p2', 'p3']);
});

test('partial names do not match', () => {
    assert.deepEqual(matchPersons(people, 'Huy'), []);
    assert.deepEqual(matchPersons(people, 'Lý Huy'), []);
    assert.deepEqual(matchPersons(people, ''), []);
    assert.deepEqual(nameWords(' , '), []);
});
