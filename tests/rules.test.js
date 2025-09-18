const { roleScore, industryScore, completenessScore, computeRuleScore } = require('../src/services/rules');

test('roleScore decision maker', () => {
  expect(roleScore('CEO')).toBe(20);
  expect(roleScore('Head of Growth')).toBe(20);
});

test('roleScore influencer', () => {
  expect(roleScore('Marketing Manager')).toBe(10);
});

test('industryScore exact match', () => {
  const ideal = ['B2B SaaS mid-market'];
  expect(industryScore('B2B SaaS mid-market', ideal)).toBe(20);
  expect(industryScore('SaaS', ideal)).toBe(10); // adjacency
});

test('completenessScore', () => {
  const lead = { name: 'A', role: 'CEO', company: 'X', industry: 'SaaS', location: 'NY', linkedin_bio: 'bio' };
  expect(completenessScore(lead)).toBe(10);
  const incomplete = { name: 'A', role: '', company: 'X', industry: 'SaaS', location: 'NY', linkedin_bio: 'bio' };
  expect(completenessScore(incomplete)).toBe(0);
});

test('computeRuleScore totals', () => {
  const offer = { ideal_use_cases: ['B2B SaaS mid-market'] };
  const lead = { name:'A', role:'CEO', company:'X', industry:'B2B SaaS mid-market', location:'NY', linkedin_bio:'bio' };
  expect(computeRuleScore(lead, offer)).toBe(20 + 20 + 10);
});
