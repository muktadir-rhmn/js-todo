class ItemTable {
    constructor(storage, config) {
        this.status =  {DONE: "done", NOT_DONE: "not-done"};

        this.storage = storage;
        this.config = config;

        this.curCategoryID = null;
        this.curItemTable = null;

        this.handleItemAction = this.handleItemAction.bind(this);
    }

    createTableNode(categoryID) {
        const table = document.createElement("table");
        table.id = this.categoryIDToTableID(categoryID);
        table.addEventListener("click", this.handleItemAction);

        const items = this.storage.retrieveItems(categoryID);
        if(items == null || items.length === 0) return table;

        for (let i = 0; i < items.length; i++) {
            const row = this.createRowNode(items[i]);
            table.append(row);
        }

        this.curCategoryID = categoryID;
        this.curItemTable = table;
        return table;
    }

    categoryIDToTableID(categoryID) {
        return `category-${categoryID}`;
    }

    tableIDToCategoryID(tableID) {
        return parseInt(tableID.split("-")[1]);
    }

    extractCategoryID(tableNode) {
        return this.tableIDToCategoryID(tableNode.id);
    }

    storeAndPrependNewItem(item) {
        const itemObject = this.storage.storeItem(this.curCategoryID, item, this.status.NOT_DONE);
        const rowNode = this.createRowNode(itemObject);
        this.curItemTable.prepend(rowNode);
    }

    createRowNode(itemObject) {
        const row = document.createElement("tr");
        row.id = this.itemIDToRowID(itemObject.id);
        row.innerHTML = `<td><input class="status" type="checkbox" ${itemObject.status === this.status.DONE ? "checked" : ""}> </td>
                <td class="item">${itemObject.item}</td>
                <td class="actions">
                    <button class="delete">Delete</button>
                </td>`;

        if(itemObject.status === this.status.DONE && this.config.hideDoneItems) {
            row.classList.add("hidden");
        }

        return row;
    }

    changeItemText(itemID, newText) {
        document.getElementById(this.itemIDToRowID(itemID)).getElementsByClassName("item")[0].innerText = newText;
    }

    itemIDToRowID(itemID) {
        return `item-${itemID}`;
    }

    extractItemID(rowNode) {
        return parseInt(rowNode.id.split("-")[1]);
    }

    getRowOfChild(childNode) {
        let t = childNode;
        while (t.tagName !==  "TR") t = t.parentNode;
        return t;
    }

    handleItemAction(event) {
        const target = event.target;
        if(target.classList.contains("status")) {
            this.changeStatus(target);
        } else if(target.classList.contains("delete")){
            this.removeItem(target);
        } else {
            this.showDetailsOfItem(target);
        }
    }

    changeVisibilityOfDoneItems(hideDoneItems) {
        const trs = this.curItemTable.getElementsByTagName("tr");
        for(let i = 0; i < trs.length; i++) {
            if(done(trs[i]) && hideDoneItems){
                trs[i].classList.add("hidden");
            } else {
                trs[i].classList.remove("hidden");
            }
        }

        function done(rowNode) {
            return rowNode.getElementsByClassName("status")[0].checked;
        }
    }

     changeStatus(statusBox) {
        const rowNode = this.getRowOfChild(statusBox);
        if(statusBox.checked && this.config.hideDoneItems) {
            this.hideRow(rowNode);
        }

        const itemID = this.extractItemID(rowNode);
        this.storage.updateItemStatus(itemID, statusBox.checked ? this.status.DONE : this.status.NOT_DONE);
    }

     removeItem(childNode) {
        const rowNode = this.getRowOfChild(childNode);
        this.removeRow(rowNode);

        const categoryID = this.extractCategoryID(this.curItemTable);
        const itemID = this.extractItemID(rowNode);
        this.storage.removeItem(categoryID, itemID);
    }

     showDetailsOfItem(target) {
        const rowNode = this.getRowOfChild(target);

        this.highlightRow(rowNode);

        const itemID = this.extractItemID(rowNode);
        itemDetails.setCurItem(itemID);
    }

    highlightRow(rowNode) {
        const selectedElements = this.curItemTable.getElementsByClassName("selected");
        if(selectedElements.length > 0) {
            selectedElements[0].classList.remove("selected");
        }
        rowNode.classList.add("selected");
    }

    hideRow(rowNode) {
        rowNode.classList.add("hidden");
    }

    removeRow(rowNode) {
        rowNode.parentNode.removeChild(rowNode);
    }
}