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
}
