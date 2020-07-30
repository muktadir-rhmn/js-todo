class ItemDetails {
    constructor(storage, updateItem) {
        this.storage = storage;
        this.updateItem = updateItem;

        this.curItemID = null;

        this.saveItemDetails = this.saveItemDetails.bind(this);
        document.getElementById("btn-save-item-details").addEventListener("click", this.saveItemDetails);

        this.noteNode = document.getElementById("note");
        this.itemText = document.getElementById("cur-item-text");
    }

    saveItemDetails(event) {
        if(this.curItemID == null) {
            alert("Select an item");
            return;
        }

        this.storage.updateItem(this.curItemID, this.itemText.value, this.noteNode.value);
        this.updateItem(this.curItemID, this.itemText.value, this.noteNode.value);
    }

    setCurItem(curItemID) {
        const curItem = this.storage.retrieveItem(curItemID);

        this.curItemID = curItemID;
        this.itemText.value = curItem.item;
        this.noteNode.value = curItem.note;
    }

    clear() {
        this.curItemID = null;
        this.itemText.value = "";
        this.noteNode.value = "";
    }
}