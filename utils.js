let backupStore = {};

function storeAttributes(storeName, obj, attributes) {
    attributes.forEach((attrName) => {
        const attrValue = obj[attrName];
        if (attrValue !== undefined) {
            backupStore[storeName] = { ...backupStore[storeName], [attrName]: attrValue };
        }
    });
}

function restoreAttributes(storeName, obj) {
    obj = { ...obj, ...backupStore[storeName] };
    return obj;
}

function storeListAttributes(storeName, list, uidName, attributes) {
    const elements = list.map((element) => {
        const uid = element[uidName];
        let obj = uid ? { uid } : {};
        attributes.forEach((attrName) => {
            const attrValue = element[attrName];
            if (attrValue !== undefined) {
                obj = { ...obj, [attrName]: attrValue };
            }
        });
        return obj;
    });
    backupStore[storeName] = elements;
}

function restoreListAttributes(storeName, list, uidName) {
    for (const [i, value] of backupStore[storeName].entries()) {
        const uid = value[uidName];
        let item = uid ? list.find((o) => o.uid === uid) : list[i];
        if (item) {
            // item = { ...item, ...value };
            Object.assign(item, value);
        }
    }
    return list;
}