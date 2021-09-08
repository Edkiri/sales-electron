

class OrderTree extends Subject {
  constructor(parentId, rate) {
    super();
    this.orders = [];
    this.parent = document.getElementById(parentId);
    this.tree = document.createElement('ol');
    this.tree.classList.add("orderTree");
    this.createHeader();
    this.addOrderBtn = document.createElement('button');
    this.addOrderBtn.textContent = "Agregar";
    this.removeOrderBtn = document.createElement('button');
    this.removeOrderBtn.textContent = "Eliminar";
    this.removeOrderBtn.disabled = true;
    this.parent.append(this.tree, this.addOrderBtn, this.removeOrderBtn);

    this.addListeners();
  }
  createHeader() {
    const headerRow = document.createElement('li');
    headerRow.classList.add("orderHeaderRow");
    headerRow.innerHTML = `
      <span>Nombre</span>
      <span>Cantidad</span>
      <span>Precio/Unidad</span>
      <span>Total $</span>
    `;
    this.tree.appendChild(headerRow);
  }

  addListeners() {

    
    window.api.recieve("printPreOrderToTree", (orderData) => {
      this.orders.push(orderData);
      super.notify(this);
      const orderDataString = JSON.stringify(orderData);
      const treeRow = document.createElement('li');
      treeRow.dataset.orderDataString = orderDataString;
      treeRow.classList.add("orderListRow");
      treeRow.innerHTML = `
      <span>${orderData.productName}</span>
      <span>${orderData.amount}</span>
      <span>${orderData.productPrice}</span>
      <span>${orderData.total}</span>
      `;
      treeRow.onclick = (event) => {
        let tag;
        if (event.target.nodeName==="SPAN"){
          tag = event.target.parentElement;
        } else {
          tag = event.target;
        }
        this.selectRow(tag);
      }
      this.tree.appendChild(treeRow);
    })
    
    this.addOrderBtn.onclick = () => {
      window.api.send("displayProductsWindow");
    }

    this.removeOrderBtn.onclick = () => {
      const selectedRow = document.querySelector(".orderListRow.selected");
      const orderData = selectedRow.dataset.orderDataString;
      this.orders = this.orders.filter(order => 
        JSON.stringify(order) != orderData
      );
      selectedRow.remove();
      this.removeOrderBtn.disabled = true;
    }

    window.addEventListener("keydown", (event) => {
      if(event.key === "Escape") {
        const selectedRow = document.querySelector(".selected");
        if(selectedRow) {
          selectedRow.classList.remove("selected");
          this.removeOrderBtn.disabled = true;
        }
      }
    })

  }

  selectRow(tag) {
    const selectedRow = document.querySelector(".orderListRow.selected");
    if (selectedRow == tag) {
      tag.classList.remove('selected');
      this.removeOrderBtn.disabled = true;
    } else {
      if(selectedRow) selectedRow.classList.remove('selected');
      tag.classList.add("selected");
      this.removeOrderBtn.disabled = false;
    };
  }

  getTotalOrders() {
    let totalOrders = this.orders.reduce((ac, currenct) => ac + currenct.total, 0); 
    return totalOrders;
  }

}