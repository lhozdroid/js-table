/**
 * 
 * @type type
 */
export let Util = {
    /**
     * 
     */
    html: {
        /**
         * 
         * @param {type} contents
         * @returns {undefined}
         */
        parse: function (contents) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(contents, "text/html");
            return doc.body.firstChild;
        }
    },

    /**
     * 
     */
    json: {
        /**
         * 
         * @param {type} origin
         * @param {type} extension
         * @returns {Util.json.extend.result}
         */
        extend: function (origin, extension) {
            let result = origin;

            if (origin.constructor === {}.constructor && extension.constructor === {}.constructor) {
                let keys = Object.keys(extension);
                for (let k = 0; k < keys.length; k++) {
                    let key = keys[k];

                    if (origin.hasOwnProperty(key)) {
                        let originValue = origin[key];
                        let extensionValue = extension[key];

                        if (originValue.constructor === {}.constructor && extensionValue.constructor === {}) {
                            result[key] = this.extend(originValue, extensionValue);
                        } else {
                            result[key] = extensionValue;
                        }
                    } else {
                        result[key] = extension[key];
                    }
                }
            } else {
                result = extension;
            }

            return result;
        }
    },

    /**
     * 
     */
    array: {
        /**
         * 
         * @param {type} array
         * @param {type} key
         * @param {type} direction
         * @returns {unresolved}
         */
        quicksort: function (array, key, direction) {
            let pivot = array[0][key];
            let left = [];
            let right = [];

            for (let e = 1; e < array.length; e++) {
                let entity = array[e][key];

                let comparison = pivot.compare(entity.value());

                if (direction === "asc") {
                    if (comparison <= 0) {
                        right.push(array[e]);
                    } else {
                        left.push(array[e]);
                    }
                } else if (direction === "desc") {
                    if (comparison <= 0) {
                        left.push(array[e]);
                    } else {
                        right.push(array[e]);
                    }
                }
            }

            let leftSort = left.length > 1 ? this.quicksort(left, key, direction) : left;
            let rightSort = right.length > 1 ? this.quicksort(right, key, direction) : right;

            return leftSort.concat([array[0]], rightSort);
        },

        /**
         * 
         * @param {type} array
         * @returns {unresolved}
         */
        reverse: function (array) {
            let isEven = array.length % 2 === 0;

            let odd = null;
            if (!isEven) {
                odd = array[0];
                array.shift();
            }

            let length = array.length;

            for (let i = 0; i < length / 2; i++) {
                let temp = array[i];
                array[i] = array[(length - 1) - i];
                array[(length - 1) - i] = temp;
            }

            if (!isEven) {
                array.push(odd);
            }

            return array;
        },

        /**
         * 
         * @param {type} array
         * @param {type} size
         * @returns {Array|Util.array.partition.partitions}
         */
        partition: function (array, size) {
            let partitions = [];
            let temp = array.slice(0);
            while (temp.length > 0) {
                partitions.push(temp.splice(0, size));
            }

            return partitions;
        }
    },

    /**
     * 
     */
    type: {
        /**
         * 
         */
        string: {
            value: function (element) {
                return element.innerHTML;
            },
            compare: function (a, b) {
                return a.localeCompare(b);
            }
        },

        /**
         * 
         */
        number: {
            value: function (element) {
                return parseFloat(element.innerHTML);
            },
            compare: function (a, b) {
                return a === b ? 0 : a < b ? -1 : 1;
            }
        },

        /**
         * 
         */
        date: {
            value: function (element) {
                return new Date(element.innerHTML);
            },
            compare: function (a, b) {
                let aTime = a.getTime();
                let bTime = b.getTime();
                return aTime === bTime ? 0 : aTime < bTime ? -1 : 1;
            }
        },

        /**
         * 
         */
        button: {
            value: function (element) {
                return element.querySelect("button").innerHTML;
            },
            compare: function (a, b) {
                return a.localeCompare(b);
            }
        }
    }
};