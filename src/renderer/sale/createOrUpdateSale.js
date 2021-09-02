const clientFrame = new ClientFrame("clientContainer");

const orderTree = new OrderTree("ordersContainer");

const paymentTree = new PaymentTree("paymentsContainer");

window.api.recieve("printClient", (client) => {
  clientFrame.printClient(client);
})