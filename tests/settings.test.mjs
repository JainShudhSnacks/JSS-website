import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSettings } from '../src/lib/domain.mjs';

const previous = { name: 'Jain Shudh Snacks', phone: '8982819979', hours: 'Owner hours', familyNoteEn: 'Existing words', customerReviews: [] };
test('personal content saves without replacing existing business details or trusting extra fields', () => {
  const updated = validateSettings({ familyName: '  Owner name  ', familyPortrait: '/api/image/portrait.jpg', customerReviews: [{ name: 'Customer', quoteEn: 'Their actual words', quoteHi: '' }], name: 'Unexpected rename', admin: true }, previous);
  assert.equal(updated.name, previous.name);
  assert.equal(updated.hours, previous.hours);
  assert.equal(updated.familyNoteEn, previous.familyNoteEn);
  assert.equal(updated.familyName, 'Owner name');
  assert.equal(updated.admin, undefined);
  assert.equal(updated.customerReviews[0].quoteEn, 'Their actual words');
  assert.deepEqual(validateSettings({ customerReviews: [{ name: '', quoteEn: '', quoteHi: '' }] }, previous).customerReviews, []);
});

test('portrait links and customer comments reject incomplete or unsafe values', () => {
  for (const familyPortrait of ['javascript:alert(1)', '//unknown.test/image', '/images/../file', 'https://user:secret@example.com/photo.jpg']) assert.throws(() => validateSettings({ familyPortrait }, previous));
  assert.throws(() => validateSettings({ customerReviews: [{ name: '', quoteEn: 'A comment' }] }, previous));
  assert.throws(() => validateSettings({ customerReviews: Array(4).fill({ name: 'Customer', quoteEn: 'Words' }) }, previous));
  assert.equal(validateSettings({ familyPortrait: 'https://example.com/portrait.webp' }, previous).familyPortrait, 'https://example.com/portrait.webp');
});
