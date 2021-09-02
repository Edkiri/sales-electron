

class OrderTree {
  constructor(parentId) {
    this.parent = document.getElementById(parentId);
    this.treeContainer = document.createElement('ol');
    this.createHeader();
    this.addOrderBtn = document.createElement('button');
    this.addOrderBtn.textContent = "Agregar";
    this.addOrderBtn.onclick = () => {
      window.api.send("displayProductsWindow");
    }
    this.parent.append(this.treeContainer, this.addOrderBtn);

    this.addListeners();
  }
  createHeader() {
    const headerRow = document.createElement('li');
    const name = document.createElement('span');
    const amount = document.createElement('span');
    const pricePerUnit = document.createElement('span');
    const total = document.createElement('span');
    name.textContent = "Nombre";
    amount.textContent = "Cantidad";
    pricePerUnit.textContent = "Precio/Unidad";
    total.textContent = "Total $";
    headerRow.append(name, amount, pricePerUnit, total);
    this.treeContainer.appendChild(headerRow);
  }

  addListeners() {

    window.api.recieve("printPreOrderToTree", (orderData) => {
      const treeRow = document.createElement('li');
      treeRow.dataset.productId = orderData.productId;
      const name = document.createElement('span');
      const amount = document.createElement('span');
      const pricePerUnit = document.createElement('span');
      const total = document.createElement('span');
      name.textContent = orderData.productName;
      amount.textContent = orderData.amount;
      pricePerUnit.textContent = orderData.productPrice;
      total.textContent = orderData.total;
      treeRow.append(name, amount, pricePerUnit, total);
      this.treeContainer.appendChild(treeRow);
    })

  }
}