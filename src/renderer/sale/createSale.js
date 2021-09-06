let dailyRate;
window.api.send("getDailyRate");
window.api.recieve('rateValue', rate => {
  dailyRate = parseInt(rate);
})

const paymentTree = new PaymentTree("paymentsContainer");

const orderTree = new OrderTree("ordersContainer");

const clientFrame = new ClientFrame("clientContainer");


const totalOrdersObserver = new TotalOrdersObserver(
  document.getElementById("totalOrdersUsd"),
  document.getElementById("totalOrdersBs")
)

const totalPaymentsObserver = new TotalPaymentsObserver(
  document.getElementById("totalPaymentsUsd"),
  document.getElementById("totalPaymentsBs")
)

const totalRemainingObserver = new TotalRemainingObserver(
  document.getElementById("totalRemainingUsd"),
  document.getElementById("totalRemainingBs")
)

orderTree.subscribe(totalOrdersObserver);
paymentTree.subscribe(totalPaymentsObserver);

orderTree.subscribe(totalRemainingObserver);
paymentTree.subscribe(totalRemainingObserver);