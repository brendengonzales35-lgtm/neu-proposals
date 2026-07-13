const NEUStorage = {
  defaultPrices: [
    { id: crypto.randomUUID(), name: "20-Amp Circuit", category: "Circuits", cost: 220, price: 450 },
    { id: crypto.randomUUID(), name: "Standard Receptacle", category: "Devices", cost: 28, price: 125 }
  ],
  getPrices() {
    const saved = localStorage.getItem("neuPriceBook");
    if (saved) return JSON.parse(saved);
    this.savePrices(this.defaultPrices);
    return this.defaultPrices;
  },
  savePrices(items) {
    localStorage.setItem("neuPriceBook", JSON.stringify(items));
  },
  saveProposal(data) {
    localStorage.setItem("neuCurrentProposal", JSON.stringify(data));
  },
  getProposal() {
    const saved = localStorage.getItem("neuCurrentProposal");
    return saved ? JSON.parse(saved) : null;
  },
  clearProposal() {
    localStorage.removeItem("neuCurrentProposal");
  }
};
