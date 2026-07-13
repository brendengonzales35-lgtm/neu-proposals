const tbody = document.getElementById("priceItems");
const itemCount = document.getElementById("itemCount");
let items = NEUStorage.getPrices();

function render() {
  tbody.innerHTML = "";
  itemCount.textContent = items.length;

  items.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input value="${item.name}" data-field="name" /></td>
      <td><input value="${item.category}" data-field="category" /></td>
      <td><input type="number" min="0" step="0.01" value="${item.cost}" data-field="cost" /></td>
      <td><input type="number" min="0" step="0.01" value="${item.price}" data-field="price" /></td>
      <td><button class="delete-btn">Delete</button></td>
    `;

    tr.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", () => {
        const field = input.dataset.field;
        item[field] = ["cost", "price"].includes(field)
          ? Number(input.value) || 0
          : input.value;
        NEUStorage.savePrices(items);
      });
    });

    tr.querySelector(".delete-btn").addEventListener("click", () => {
      items = items.filter(x => x.id !== item.id);
      NEUStorage.savePrices(items);
      render();
    });

    tbody.appendChild(tr);
  });
}

document.getElementById("addPriceBtn").addEventListener("click", () => {
  items.unshift({
    id: crypto.randomUUID(),
    name: "New Item",
    category: "General",
    cost: 0,
    price: 0
  });
  NEUStorage.savePrices(items);
  render();
});

render();
