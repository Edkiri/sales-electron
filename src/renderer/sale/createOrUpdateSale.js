const clientFrame = new ClientFrame("clientContainer");

const orderTree = new OrderTree("ordersContainer");

window.api.recieve("printClient", (client) => {
  clientFrame.printClient(client);
})