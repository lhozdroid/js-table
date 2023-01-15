import {Loader} from "./loader.js";
import {Util} from "./util.js";
import {JSHeader} from "./js-header.js";
import {JSBody} from "./js-body.js";

/**
 * 
 * @type type
 */
export class JSTable {
    #loader = new Loader("./fragments/");

    #configuration = {
        features: {
            paging: true,
            sorting: true,
            filtering: true
        },
        paging: {
            sizes: {
                "10": 10,
                "50": 50,
                "All": -1
            }
        }
    };

    #table = null;
    #container = null;

    #jsHeader = null;
    #jsBody = null;

    /**
     * 
     * @param {type} selector
     * @param {type} configuration
     * @returns {undefined}
     */
    constructor(selector, configuration) {
        let self = this;

        this.#table = document.querySelector(selector);
        this.#configuration = Util.json.extend(this.#configuration, configuration);

        this.#load().then(() => {
            self.#wrap();

            self.#jsHeader = new JSHeader();
            self.#jsBody = new JSBody();

            self.#jsHeader.loader = self.#loader;
            self.#jsHeader.jsTable = self;
            self.#jsHeader.jsBody = self.#jsBody;

            self.#jsBody.loader = self.#loader;
            self.#jsBody.jsTable = self;
            self.#jsBody.jsHeader = self.#jsHeader;

            self.#jsHeader.init();
            self.#jsBody.init();

            self.#jsBody.refresh();
        });
    }

    /**
     * 
     * @returns {undefined}
     */
    #wrap() {
        this.#container = this.#loader.get("container.html");
        this.#table.replaceWith(this.#container);
        this.#container.querySelector("[data-id='table']").append(this.#table);
    }

    /**
     * 
     * @returns {undefined}
     */
    #load() {
        let self = this;
        return new Promise((resolve, reject) => {
            let promises = [];
            promises.push(self.#loader.load("container.html"));

            if (self.#configuration.features.sorting) {
                promises.push(self.#loader.load("header.html"));
            }

            if (self.#configuration.features.paging) {
                promises.push(self.#loader.load("size.html"));
                promises.push(self.#loader.load("index.html"));
                promises.push(self.#loader.load("summary.html"));
            }

            if (self.#configuration.features.filtering) {
                promises.push(self.#loader.load("filter.html"));
            }

            Promise.all(promises).then(() => resolve());
        });
    }

    /**
     * 
     * @returns {JSTable.#table}
     */
    get table() {
        return this.#table;
    }

    /**
     * 
     * @returns {unresolved}
     */
    get container() {
        return this.#container;
    }

    /**
     * 
     * @returns {#configuration}
     */
    get configuration() {
        return this.#configuration;
    }
}