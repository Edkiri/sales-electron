
class PaymentTree extends Subject {
  constructor(parentId) {
    super();
    this.parent = document.getElementById(parentId);
    this.tree = document.createElement('ol');
    this.createHeader()
    this.parent.appendChild(this.tree);
    this.payments = [];

    this.addPayBtn = document.createElement('button');
    this.addPayBtn.textContent = "Pago";
    this.addPayBtn.onclick = () => {
      this.createPayment(false)
    };

    this.addReturnBtn = document.createElement('button');
    this.addReturnBtn.textContent = "Vuelto";
    this.addReturnBtn.onclick = () => {
      this.createPayment(true);
    }
    this.parent.append(this.addPayBtn, this.addReturnBtn);
    
    this.addListeners();

  }

  createHeader() {
    const headerTree = document.createElement('li');
    const amount = document.createElement('span');
    const currency = document.createElement('span');
    const method = document.createElement('span');
    amount.textContent = "Monto";
    currency.textContent = "Moneda";
    method.textContent = "Método";
    headerTree.append(amount, currency, method);
    this.tree.appendChild(headerTree);
  }

  createPayment(isReturn) {
    
    window.api.send("createPayment", isReturn);
  }

  addPayment(paymentData) {
    this.payments.push(paymentData);
    super.notify(this);
    const treeRow = document.createElement('li');
    treeRow.classList.add("paymentRow");
    treeRow.dataset.currencyId = paymentData.currency.id;
    treeRow.dataset.methodId = paymentData.method.id;
    treeRow.dataset.accountId = paymentData.accountId;
    let amount = document.createElement('span');
    const currency = document.createElement('span');
    const method = document.createElement('span');
    amount.textContent = paymentData.amount;
    if (paymentData.isReturn) amount.textContent = `${paymentData.amount}`;
    currency.textContent = paymentData.currency.name;
    method.textContent = paymentData.method.name;
    treeRow.append(amount, currency, method);
    this.tree.appendChild(treeRow);
  }

  addListeners() {

    window.api.recieve('addPaymentToTree', paymentData => {
      this.addPayment(paymentData);
    })

  }

  getTotalPayments() {
    let totalPayments = 0;
    this.payments.forEach(pay => {
      if(pay.currency.id != "1") {
        totalPayments += pay.amount / dailyRate;
      } else {
        totalPayments += pay.amount;
      }
    })
    return totalPayments;
  }

}