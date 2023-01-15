/**
 * 
 * @type type
 */
export class Loader {
    #cache = {};
    #url = "";

    /**
     * 
     * @param {type} relative
     * @returns {undefined}
     */
    constructor(relative) {
        this.#url = new URL(relative, import.meta.url).href;
    }

    /**
     * 
     * @param {type} asset
     * @param {type} name
     * @returns {Promise}
     */
    load(asset, name) {
        name = name || asset;
        let self = this;

        return new Promise((resolve, reject) => {
            fetch(this.#url + asset, {
                method: "GET",
                mode: "cors",
                credentials: "same-origin"
            }).then((response) => {
                return response.text();
            }).then((html) => {
                self.#cache[name] = html;
                resolve();
            });
        });
    }

    /**
     * 
     * @param {type} asset
     * @returns {.parser@call;parseFromString.body}
     */
    get(asset) {
        let contents = this.#cache.hasOwnProperty(asset) ? this.#cache[asset] : "";
        let parser = new DOMParser();
        let doc = parser.parseFromString(contents, "text/html");
        return doc.body.firstChild;
    }
}