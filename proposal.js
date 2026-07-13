const tbody = document.getElementById("lineItems");

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value) || 0);
}

function addRow(item = {}) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input class="desc" value="${item.description || ""}" placeholder="Describe work or material" /></td>
    <td><input class="qty" type="number" min="0" step="1" value="${item.qty ?? 1}" /></td>
    <td><input class="cost money" type="number" min="0" step="0.01" value="${item.cost ?? 0}" /></td>
    <td><input class="price money" type="number" min="0" step="0.01" value="${item.price ?? 0}" /></td>
    <td class="line-total">$0.00</td>
    <td><button class="delete-btn">Delete</button></td>
  `;
  tr.querySelectorAll("input").forEach(el =>
    el.addEventListener("input", calculateTotals)
  );
  tr.querySelector(".delete-btn").addEventListener("click", () => {
    tr.remove();
    calculateTotals();
  });
  tbody.appendChild(tr);
  calculateTotals();
}

function calculateTotals() {
  let sell = 0;
  let cost = 0;

  [...tbody.rows].forEach(row => {
    const qty = Number(row.querySelector(".qty").value) || 0;
    const unitCost = Number(row.querySelector(".cost").value) || 0;
    const unitPrice = Number(row.querySelector(".price").value) || 0;

    sell += qty * unitPrice;
    cost += qty * unitCost;
    row.querySelector(".line-total").textContent = currency(qty * unitPrice);
  });

  document.getElementById("sellingTotal").textContent = currency(sell);
  document.getElementById("costTotal").textContent = currency(cost);
  document.getElementById("profitTotal").textContent = currency(sell - cost);
  document.getElementById("heroTotal").textContent = currency(sell);
}

function parseQuickText() {
  const text = document.getElementById("quickText").value.toLowerCase().trim();
  if (!text) return;

  const prices = NEUStorage.getPrices();
  const circuit = prices.find(x => x.name.toLowerCase().includes("20-amp circuit"));
  const receptacle = prices.find(x => x.name.toLowerCase().includes("standard receptacle"));

  let added = false;

  if (text.includes("20 amp") || text.includes("20-amp")) {
    addRow({
      description: "Furnish and install one new 20-amp branch circuit",
      qty: 1,
      cost: circuit?.cost || 0,
      price: circuit?.price || 0
    });
    added = true;
  }

  const receptacleMatch = text.match(/(\d+)\s+receptacle/);
  if (receptacleMatch) {
    addRow({
      description: "Furnish and install standard duplex receptacle",
      qty: Number(receptacleMatch[1]),
      cost: receptacle?.cost || 0,
      price: receptacle?.price || 0
    });
    added = true;
  }

  if (!added) {
    addRow({
      description: document.getElementById("quickText").value,
      qty: 1,
      cost: 0,
      price: 0
    });
  }

  document.getElementById("quickText").value = "";
}

function collectProposal() {
  return {
    customerName: document.getElementById("customerName").value,
    proposalNumber: document.getElementById("proposalNumber").value,
    customerAddress: document.getElementById("customerAddress").value,
    proposalDate: document.getElementById("proposalDate").value,
    jobAddress: document.getElementById("jobAddress").value,
    notes: document.getElementById("notes").value,
    items: [...tbody.rows].map(row => ({
      description: row.querySelector(".desc").value,
      qty: Number(row.querySelector(".qty").value) || 0,
      cost: Number(row.querySelector(".cost").value) || 0,
      price: Number(row.querySelector(".price").value) || 0
    }))
  };
}

function saveProposal() {
  NEUStorage.saveProposal(collectProposal());
  alert("Proposal saved in this browser.");
}

function loadProposal() {
  const saved = NEUStorage.getProposal();
  document.getElementById("proposalDate").value = new Date().toISOString().slice(0, 10);

  if (!saved) {
    addRow();
    return;
  }

  ["customerName", "proposalNumber", "customerAddress", "proposalDate", "jobAddress", "notes"]
    .forEach(id => {
      if (saved[id] !== undefined) document.getElementById(id).value = saved[id];
    });

  (saved.items || []).forEach(addRow);
  if (!saved.items?.length) addRow();
}

document.getElementById("addRowBtn").addEventListener("click", () => addRow());
document.getElementById("parseBtn").addEventListener("click", parseQuickText);
document.getElementById("quickText").addEventListener("keydown", event => {
  if (event.key === "Enter") parseQuickText();
});
document.getElementById("saveBtn").addEventListener("click", saveProposal);
document.getElementById("saveBtnBottom").addEventListener("click", saveProposal);
document.getElementById("printBtn").addEventListener("click", () => window.print());
document.getElementById("clearBtn").addEventListener("click", () => {
  if (!confirm("Clear this proposal?")) return;
  NEUStorage.clearProposal();
  location.reload();
});

loadProposal();
