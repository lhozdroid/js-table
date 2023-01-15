import {Util} from "./util.js";

/**
 * 
 * @type type
 */
export class JSBody {
    #loader = null;

    #jsTable = null;
    #jsHeader = null;

    #data = [];

    #sorted = null;
    #filtered = null;
    #paged = null;

    #size = null;

    #query = "";
    #index = 0;

    #sortingChanged = true;
    #filteringChanged = true;
    #pagingChanged = true;

    /**
     * 
     * @returns {undefined}
     */
    init() {
        this.#parse();
        this.#draw();
    }

    /**
     * 
     * @returns {undefined}
     */
    refresh() {
        this.#refreshSorting();
        this.#refreshFiltering();
        this.#refreshPaging();
    }

    /**
     * 
     * @returns {undefined}
     */
    #refreshPaging() {
        let configuration = this.#jsTable.configuration;

        if (configuration.features.paging && this.#size !== null && this.#size !== -1 && this.#pagingChanged) {
            this.#paged = Util.array.partition(this.#filtered, this.#size);
            this.#pagingChanged = false;
        } else {
            this.#paged = [this.#filtered];
            this.#index = 0;
        }

        let tbody = document.createElement("tbody");
        let ids = this.#jsHeader.ids;
        let page = this.#paged[this.#index];

        for (let p = 0; p < page.length; p++) {
            let row = page[p];

            let tr = document.createElement("tr");
            tbody.append(tr);

            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let cell = row[id];

                tr.append(cell.element);
            }
        }

        this.#jsTable.table.querySelector("tbody").replaceWith(tbody);

        this.#jsTable.container.querySelector("[data-id='summary'] [data-id='page']").innerHTML = (this.#index + 1);
        this.#jsTable.container.querySelector("[data-id='summary'] [data-id='total']").innerHTML = this.#paged.length;
    }

    /**
     * 
     * @returns {undefined}
     */
    #refreshFiltering() {
        let configuration = this.#jsTable.configuration;

        let ids = this.#jsHeader.ids;
        let headers = this.#jsHeader.headers;

        if (configuration.features.filtering && this.#query !== "" && this.#filteringChanged) {
            this.#filtered = [];

            for (let r = 0; r < this.#sorted.length; r++) {
                let row = this.#sorted[r];

                for (let i = 0; i < ids.length; i++) {
                    let id = ids[i];
                    let header = headers[id];
                    let cell = row[id];

                    if (header.filtering && String(cell.value()).toLowerCase().includes(this.#query)) {
                        this.#filtered.push(row);
                        break;
                    }
                }
            }

            this.#filteringChanged = false;
        } else {
            this.#filtered = this.#filtered === null || this.#query === "" ? this.#sorted : this.#filtered;
        }
    }

    /**
     * 
     * @returns {undefined}
     */
    #refreshSorting() {
        let configuration = this.#jsTable.configuration;

        if (configuration.features.sorting && this.#sortingChanged) {
            let index = this.#jsHeader.index;
            let direction = this.#jsHeader.direction;

            this.#sorted = Util.array.quicksort(this.#data, index, direction);

            this.#jsHeader.refresh(index, direction);

            this.#sortingChanged = false;
        } else {
            this.#sorted = this.#sorted === null ? this.#data : this.#sorted;
        }
    }

    /**
     * 
     * @returns {undefined}
     */
    #draw() {
        let configuration = this.#jsTable.configuration;

        if (configuration.features.paging) {
            this.#drawPaging();
        }

        if (configuration.features.filtering) {
            this.#drawFiltering();
        }
    }

    /**
     * 
     * @returns {undefined}
     */
    #drawPaging() {
        let self = this;

        let container = this.#jsTable.container;
        let configuration = this.#jsTable.configuration;

        let loader = this.#loader;
        let size = loader.get("size.html");
        let summary = loader.get("summary.html");
        let index = loader.get("index.html");

        container.querySelector("[data-id='size']").append(size);
        container.querySelector("[data-id='summary']").append(summary);
        container.querySelector("[data-id='index']").append(index);

        let sizes = configuration.paging.sizes;
        let sizeSelect = size.querySelector("select");

        let titles = Object.keys(sizes);
        for (let t = 0; t < titles.length; t++) {
            let title = titles[t];
            let size = sizes[title];

            let option = document.createElement("option");
            option.value = size;
            option.innerHTML = title;

            sizeSelect.append(option);

            if (this.#size === null) {
                this.#size = size;
            }
        }

        sizeSelect.addEventListener("change", () => {
            self.#size = parseInt(sizeSelect.options[sizeSelect.selectedIndex].value);

            self.#pagingChanged = true;
            self.refresh();
        });

        index.querySelector("[data-id='backward']").addEventListener("click", () => {
            self.#index = 0;

            self.#pagingChanged = true;
            self.refresh();
        });
        index.querySelector("[data-id='backward-step']").addEventListener("click", () => {
            self.#index = Math.max(0, self.#index - 1);

            self.#pagingChanged = true;
            self.refresh();
        });
        index.querySelector("[data-id='forward-step']").addEventListener("click", () => {
            self.#index = Math.min(self.#paged.length - 1, self.#index + 1);

            self.#pagingChanged = true;
            self.refresh();
        });
        index.querySelector("[data-id='forward']").addEventListener("click", () => {
            self.#index = self.#paged.length - 1;

            self.#pagingChanged = true;
            self.refresh();
        });
    }

    /**
     * 
     * @returns {undefined}
     */
    #drawFiltering() {
        let self = this;

        let container = this.#jsTable.container;

        let loader = this.#loader;
        let filter = loader.get("filter.html");

        container.querySelector("[data-id='filter']").append(filter);

        let input = filter.querySelector("input");
        input.addEventListener("keyup", () => {
            let value = input.value;

            setTimeout(() => {
                if (value === input.value) {
                    self.#query = value.toLowerCase();

                    self.#filteringChanged = true;
                    self.#pagingChanged = true;
                    self.refresh();
                }
            }, 500);
        });
    }

    /**
     * 
     * @returns {undefined}
     */
    #parse() {
        let table = this.#jsTable.table;
        let configuration = this.#jsTable.configuration;

        let trs = table.querySelectorAll("tbody tr");
        let ids = this.#jsHeader.ids;
        for (let r = 0; r < trs.length; r++) {
            let tr = trs[r];
            let tds = tr.querySelectorAll("td");

            let row = {};

            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let td = tds[i];

                let type = td.hasAttribute("data-type") ? td.getAttribute("data-type") : "string";

                row[id] = {
                    "element": td,
                    "type": type,
                    "value": (() => Util.type[type].value(td)),
                    "compare": ((b) => Util.type[type].compare(Util.type[type].value(td), b))
                };
            }

            this.#data.push(row);
        }
    }

    /**
     * 
     * @param {type} loader
     * @returns {undefined}
     */
    set loader(loader) {
        this.#loader = loader;
    }

    /**
     * 
     * @param {type} jsTable
     * @returns {undefined}
     */
    set jsTable(jsTable) {
        this.#jsTable = jsTable;
    }

    /**
     * 
     * @param {type} jsHeader
     * @returns {undefined}
     */
    set jsHeader(jsHeader) {
        this.#jsHeader = jsHeader;
    }

    /**
     * 
     * @param {type} value
     * @returns {undefined}
     */
    set sortingChanged(value) {
        this.#sortingChanged = value;
    }

    /**
     * 
     * @param {type} value
     * @returns {undefined}
     */
    set filteringChanged(value) {
        this.#filteringChanged = value;
    }

    /**
     * 
     * @param {type} value
     * @returns {undefined}
     */
    set pagingChanged(value) {
        this.#pagingChanged = value;
    }
}