class Storage {
    STATE_KEY = "storage-state";
    CATEGORY_LIST_KEY = "categoryList";
    CONFIGURATION_KEY = "configuration";

    constructor() {
        this.retrieveState();
    }

    retrieveState() {
        this.state = this.retrieve(this.STATE_KEY);
        if(this.state === null) {
            this.state = {
                nextCategoryIndex: 1,
                nextItemIndex: 0,
            }
            this.store(this.STATE_KEY, this.state);
        }
    }

    storeConfiguration(config) {
        this.store(this.CONFIGURATION_KEY, config);
    }

    retrieveConfiguration() {
        let config = this.retrieve(this.CONFIGURATION_KEY);
        if(config == null) {
            config = {
                hideDoneItems: false,
            }
            this.storeConfiguration(config);
        }
        return config;
    }

    retrieveCategories() {
        this.categories = this.retrieve(this.CATEGORY_LIST_KEY);
        if (this.categories === null) {
            this.categories = [{
                id: 0,
                name: "First Category",
            }]
            this.store(this.CATEGORY_LIST_KEY, this.categories);
        }

        return this.categories;
    }

    addNewCategory(categoryName) {
        const categoryID = this.nextCategoryIndex();
        this.categories.push({
            id: categoryID,
            name: categoryName,
        })
        this.store(this.CATEGORY_LIST_KEY, this.categories);

        return categoryID
    }

    retrieveItemIDs(categoryID) {
        const categoryKey = this.categoryIDToKey(categoryID);
        let itemIDs = this.retrieve(categoryKey);
        if(itemIDs == null) {
            itemIDs = [];
        }
        return itemIDs;
    }

    storeItemIDS(categoryID, itemIDs) {
        const categoryKey = this.categoryIDToKey(categoryID);
        this.store(categoryKey, itemIDs);
    }

    nextCategoryIndex() {
        const i = this.state.nextCategoryIndex++;
        this.store(this.STATE_KEY, this.state);
        return i;
    }

    nextItemIndex() {
        const i = this.state.nextItemIndex++;
        this.store(this.STATE_KEY, this.state);
        return i;
    }

    storeItem(categoryID, item, status, note="") {
        const itemObject = {
            id: this.nextItemIndex(),
            item: item,
            status: status,
            note: note,
        }

        const itemKey = this.itemIDToKey(itemObject.id);
        this.store(itemKey, itemObject);

        const itemIDs = this.retrieveItemIDs(categoryID);
        itemIDs.push(itemObject.id);
        this.storeItemIDS(categoryID, itemIDs);

        return itemObject;
    }

    retrieveItem(itemID) {
        return this.retrieve(this.itemIDToKey(itemID));
    }

    retrieveItems(categoryID) {
        const categoryKey = this.categoryIDToKey(categoryID);

        let itemIDs = this.retrieve(categoryKey);
        if(itemIDs == null) return [];

        const items = [];
        for(let i = itemIDs.length - 1; i >= 0; i--) {
            const itemObject = this.retrieveItem(itemIDs[i]);
            items.push(itemObject);
        }

        return items;
    }

    removeItem(categoryID, itemID) {
        this.delete(this.itemIDToKey(itemID));

        const itemIDs = this.retrieveItemIDs(categoryID);
        const newItemIDs = [];
        for(let i = 0; i < itemIDs.length; i++) {
            if(itemIDs[i] !== itemID) newItemIDs.push(itemIDs[i]);
        }
        this.storeItemIDS(categoryID, newItemIDs)
    }

    updateItemStatus(itemID, newStatus) {
        this._updateItem(itemID, (itemObject) => {itemObject.status = newStatus});
    }

    updateItem(itemID, newText, newNote) {
        this._updateItem(itemID, (itemObject) => {itemObject.item = newText; itemObject.note = newNote;});
    }

    _updateItem(itemID, changer) {
        const itemKey = this.itemIDToKey(itemID);

        let itemObject = this.retrieve(itemKey);
        changer(itemObject);

        this.store(itemKey, itemObject);
    }

    itemIDToKey(itemID) {
        return `item-${itemID}`;
    }

    categoryIDToKey(categoryID) {
        return `cat-${categoryID}`;
    }

    store(key, object) {
        localStorage.setItem(key, JSON.stringify(object));
    }

    retrieve(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    delete(key) {
        localStorage.removeItem(key);
    }

}