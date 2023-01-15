import {Util} from "./util.js";

/**
 * 
 * @type type
 */
export class JSHeader {
    #loader = null;

    #jsTable = null;
    #jsBody = null;

    #ids = [];
    #headers = {};

    #index = 0;
    #direction = "asc";

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
     * @param {type} id
     * @param {type} direction
     * @returns {undefined}
     */
    refresh(id, direction) {
        id = id || this.#ids[0];
        direction = direction || "asc";

        let configuration = this.#jsTable.configuration;
        if (configuration.features.sorting) {
            for (let i = 0; i < this.#ids.length; i++) {
                let hid = this.#ids[i];
                let header = this.#headers[hid];

                if (header.sorting) {
                    if (hid === id) {
                        if (direction === "asc") {
                            header.element.querySelector("[data-id='direction']").className = "fa-solid fa-sort-up fa-fw";
                        } else {
                            header.element.querySelector("[data-id='direction']").className = "fa-solid fa-sort-down fa-fw";
                        }
                    } else {
                        header.element.querySelector("[data-id='direction']").className = "fa-solid fa-sort fa-fw opacity-50";
                    }
                }
            }
        }
    }

    /**
     * 
     * @returns {undefined}
     */
    #draw() {
        let self = this;

        let loader = this.#loader;

        let table = this.#jsTable.table;
        let tr = table.querySelector("thead tr");
        tr.innerHTML = "";

        for (let i = 0; i < this.#ids.length; i++) {
            let id = this.#ids[i];
            let header = this.#headers[id];

            let html = loader.get("header.html");
            html.querySelector("[data-id='contents']").append(header.element);

            if (header.sorting) {
                let direction = html.querySelector("[data-id='direction']");
                let contents = html.querySelector("[data-id='contents']");

                direction.className = "fa-solid fa-sort fa-fw opacity-50";
                direction.style.cursor = "pointer";

                contents.style.cursor = "pointer";

                [direction, contents].forEach(element => element.addEventListener("click", () => {
                        self.#direction = id === self.#index ? (self.#direction === "asc" ? "desc" : "asc") : "asc";
                        self.#index = id;

                        self.#jsBody.sortingChanged = true;
                        self.#jsBody.filteringChanged = true;
                        self.#jsBody.pagingChanged = true;

                        self.#jsBody.refresh();
                    }));
            }

            let th = document.createElement("th");
            th.append(html);

            tr.append(th);
            header.element = th;
        }
    }

    /**
     * 
     * @returns {undefined}
     */
    #parse() {
        let table = this.#jsTable.table;
        let configuration = this.#jsTable.configuration;

        let ths = table.querySelectorAll("thead th");
        for (let i = 0; i < ths.length; i++) {
            let th = ths[i];
            let id = th.hasAttribute("data-id") ? th.getAttribute("data-id") : String(i);
            let element = document.createElement("div");
            element.className = "d-inline";
            if (th.children.length > 0) {
                element.append(th.children);
            } else {
                element.innerHTML = th.innerHTML;
            }

            let sorting = (th.hasAttribute("data-sort") ? th.getAttribute("data-sort") === "true" : true) && configuration.features.sorting;
            let filtering = (th.hasAttribute("data-filter") ? th.getAttribute("data-filter") === "true" : true) && configuration.features.filtering;

            this.#ids.push(id);
            this.#headers[id] = {
                "element": element,
                "sorting": sorting,
                "filtering": filtering
            };
        }

        for (let i = 0; i < this.#ids.length; i++) {
            let id = this.#ids[i];
            let header = this.#headers[id];

            if (header.sorting) {
                this.#index = id;
                break;
            }
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
     * @param {type} jsBody
     * @returns {undefined}
     */
    set jsBody(jsBody) {
        this.#jsBody = jsBody;
    }

    /**
     * 
     * @param {type} index
     * @returns {undefined}
     */
    set index(index) {
        this.#index = index;
    }

    /**
     * 
     * @param {type} direction
     * @returns {undefined}
     */
    set direction(direction) {
        this.#direction = direction;
    }

    /**
     * 
     * @returns
     */
    get index() {
        return this.#index;
    }

    /**
     * 
     * @returns
     */
    get direction() {
        return this.#direction;
    }

    /**
     * 
     * @returns {Array}
     */
    get ids() {
        return this.#ids;
    }

    /**
     * 
     * @returns {JSHeader.#headers}
     */
    get headers() {
        return this.#headers;
    }
}