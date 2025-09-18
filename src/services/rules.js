const ROLE_DECISION_MAKER_KEYWORDS = [
  'ceo','founder','co-founder','cto','cfo','coo',
  'head of','vp','vice president','director','owner','president'
];
const ROLE_INFLUENCER_KEYWORDS = [
  'manager','lead','senior','principal','coordinator','analyst'
];

function roleScore(roleText = '') {
  const r = roleText.toLowerCase();
  if (ROLE_DECISION_MAKER_KEYWORDS.some(k => r.includes(k))) return 20;
  if (ROLE_INFLUENCER_KEYWORDS.some(k => r.includes(k))) return 10;
  return 0;
}

function industryScore(leadIndustry = '', idealUseCases = []) {
  if (!leadIndustry || idealUseCases.length === 0) return 0;
  const li = leadIndustry.toLowerCase();
  for (const ic of idealUseCases) {
    if (li === ic.toLowerCase()) return 20;
  }
  const leadTokens = li.split(/\W+/);
  for (const ic of idealUseCases) {
    const icTokens = ic.toLowerCase().split(/\W+/);
    if (leadTokens.some(t => icTokens.includes(t))) return 10;
  }

  return 0;
}

function completenessScore(lead) {
  const fields = ['name','role','company','industry','location','linkedin_bio'];
  return fields.every(f => typeof lead[f] === 'string' && lead[f].trim().length > 0) ? 10 : 0;
}

function computeRuleScore(lead, offer) {
  const r1 = roleScore(lead.role);
  const r2 = industryScore(lead.industry, offer?.ideal_use_cases || []);
  const r3 = completenessScore(lead);
  return r1 + r2 + r3;
}

module.exports = { roleScore, industryScore, completenessScore, computeRuleScore };
