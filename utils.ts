namespace TsUtils {
    let backupStore: Record<string, any> = {};
    type StoreKey = keyof typeof backupStore;

    function storeAttributes(storeName: StoreKey, obj: Record<string, any>, attributes: string[]) {
        type ObjectKey = keyof typeof obj;
        let store: Record<string, any> = (backupStore[storeName] = {});
        attributes.forEach((attrName: ObjectKey) => {
            const attrValue = obj[attrName];
            if (attrValue !== undefined) {
                Object.assign(store, { [attrName]: attrValue });
            }
        });
    }

    function restoreAttributes(storeName: StoreKey, obj: object) {
        let store: Record<string, any> = backupStore[storeName];
        Object.assign(obj, store);
        return obj;
    }

    function storeListAttributes(
        storeName: StoreKey,
        list: Record<string, any>[],
        attributes: string[],
        uidName?: string
    ) {
        const elements = list.map((element) => {
            let obj = uidName && element[uidName] ? { uid: element[uidName] } : {};
            attributes.forEach((attrName) => {
                const attrValue = element[attrName];
                if (attrValue !== undefined) {
                    obj = { ...obj, [attrName]: attrValue };
                }
            });
            return obj;
        });
        let store = ((backupStore[storeName] as Record<string, object>[]) = []);
        Object.assign(store, elements);
    }

    function restoreListAttributes(
        storeName: StoreKey,
        list: Record<string, any>[],
        uidName?: string
    ) {
        let store: Record<string, object>[] = backupStore[storeName];
        for (const [i, value] of store.entries()) {
            let item;
            if (uidName) {
                const uid = value[uidName];
                item = list.find((o) => o.uid === uid);
            } else {
                item = list[i];
            }
            if (item) {
                Object.assign(item, value);
            }
        }
        return list;
    }

    function addElementListenerByClass(className: string) {
        const inputElement = document.querySelector(`.${className} input`) as HTMLInputElement;
        inputElement.removeEventListener("input", blurHandler);
        inputElement.addEventListener("input", blurHandler, { passive: true });
    }

    function blurHandler(event: Event) {
        const target = event.target as HTMLInputElement;
        const enteredValue = target.value;
        const inputValue = enteredValue.replace(/\s/g, "");
        if (/^\d{4}\-[1-9]{2}\d{4}$/.test(inputValue)) {
            const converted = `${inputValue.substring(0, 4)}-00${inputValue.substring(5)}`;
            target.value = converted;
            console.log(`${enteredValue.replace(/\s/g, "[sp]")} -> ${converted}`);
        } else if (/^\d{10}$/.test(inputValue)) {
            const converted = `${inputValue.substring(0, 4)}-00${inputValue.substring(4)}`;
            target.value = converted;
            console.log(`${enteredValue.replace(/\s/g, "[sp]")} -> ${converted}`);
        }
    }

    function removeDuplicates<T>(list: T[]): T[] {
        return Array.from(new Set(list));
    }

    function removeDuplicatesByFields<T>(array: T[], fields: string[]): T[] {
        const seen = new Set();
        return array.filter((item) => {
            type StatusKey = keyof typeof item;
            const key = fields
                .map((field) => {
                    return item[field as StatusKey];
                })
                .join();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    /*
    const people = [
        { firstName: "John", lastName: "Doe", age: 30 },
        { firstName: "Jane", lastName: "Doe", age: 25 },
        { firstName: "John", lastName: "Doe", age: 40 }, // duplicate based on name
        { firstName: "John", lastName: "Smith", age: 30 }
        ];

    const uniquePeople = removeDuplicatesByFields(people, ["firstName", "lastName"]);

    console.log(uniquePeople);
    */
}
