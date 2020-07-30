class CategoryList {
    constructor(storage, handleCategoryChange) {
        this.storage = storage;
        this.handleCategoryChange = handleCategoryChange;

        this.categoryList = null;

        this.addNewCategory = this.addNewCategory.bind(this);
        this.selectCategory = this.selectCategory.bind(this);

        document.getElementById("btn-add-category").addEventListener("click", this.addNewCategory);
    }

    addNewCategory(event) {
        const categoryName = prompt("Enter Category name");

        const categoryID = this.storage.addNewCategory(categoryName);

        const li = this.createLINode(categoryID, categoryName, false);
        this.categoryList.append(li);
    }

    createListNode(categories) {
        this.categoryList = document.createElement("ul");
        this.categoryList.id = "categories";
        this.categoryList.addEventListener("click", this.selectCategory);

        for(let i = 0; i < categories.length; i++) {
            const li = this.createLINode(categories[i].id, categories[i].name, i === 0);
            this.categoryList.append(li);
        }

        return this.categoryList;
    }

    selectCategory(event) {
        if(event.target.tagName !== "LI") return;

        const liCategory = event.target;
        liCategory.parentElement.getElementsByClassName("selected")[0].classList.remove("selected");
        liCategory.classList.add("selected");

        const currentCategoryID  = this.extractCategoryID(liCategory);
        this.handleCategoryChange(currentCategoryID);
    }

    createLINode(categoryID, categoryName, isSelected) {
        const li = document.createElement("li");
        li.classList.add("category");
        li.id = `cat-${categoryID}`;
        li.innerText = categoryName;

        if (isSelected) li.classList.add("selected");
        return li;
    }

    extractCategoryID(liNode) {
        return parseInt(liNode.id.split("-")[1]);
    }
}