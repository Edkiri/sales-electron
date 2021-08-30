const clientFrame = new ClientFrame("clientContainer");

window.api.recieve("printClient", (client) => {
  clientFrame.printClient(client);
})