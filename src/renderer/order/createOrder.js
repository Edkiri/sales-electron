
const productTree = new ProductTree("productTree");

const nameInput = document.getElementById("nameInput");

nameInput.addEventListener("keydown", (event) => {
  if(event.key === "Enter"){
    const name = nameInput.value;
    if(name.replaceAll(" ", "").length > 0){
      window.api.send("searchProductByName", name);
    }
  }
})

window.api.recieve('closeWindow', () => {
  window.close();
})