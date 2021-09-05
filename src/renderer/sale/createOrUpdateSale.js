let dailyRate;
window.api.send("getDailyRate");
window.api.recieve('rateValue', rate => {
  dailyRate = rate;
})

const paymentTree = new PaymentTree("paymentsContainer");

const orderTree = new OrderTree("ordersContainer");

const clientFrame = new ClientFrame("clientContainer");