const clientPreIdCard = document.getElementById("clientPreIdCard");
const clientIdCard = document.getElementById("clientIdCard");

clientIdCard.addEventListener("keydown", (event) => {
  if(event.key === "Enter") {
    const clientIdCardString = clientPreIdCard.value + "-" + clientIdCard.value;
    window.api.send("verifyClient", clientIdCardString)
  }
})

window.api.recieve("printClient", (client) => {
  console.log(client)
  // TODO: Print client
})