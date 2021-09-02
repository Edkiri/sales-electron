

class PaymentTree {
  constructor(parentId) {
    this.parent = document.getElementById(parentId);
    this.tree = document.createElement('ol');
    this.createHeader()
    this.parent.appendChild(this.tree);
  }

  createHeader() {
    const rowHeader = document.createElement('li');
    const amount = document.createElement('span');
    const currency = document.createElement('span');
    const method = document.createElement('span');
    amount.textContent = "Monto";
    currency.textContent = "Moneda";
    method.textContent = "Método";
    rowHeader.append(amount, currency, method);
    this.tree.appendChild(rowHeader);
  }

  createPayment() {
    window.api.send("createPayment");
  }

}