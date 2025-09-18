const state = { offer: null, leads: [], results: [] };

module.exports = {
  getOffer: () => state.offer,
  setOffer: (o) => { state.offer = o; },
  addLeads: (leads) => { state.leads = state.leads.concat(leads); },
  getLeads: () => state.leads,
  setResults: (r) => { state.results = r; },
  getResults: () => state.results,
  clearAll: () => { state.offer = null; state.leads = []; state.results = []; }
};
