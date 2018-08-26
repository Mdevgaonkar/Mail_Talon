const Store = require('data-store');


/********* CREATE Datastore***********/
function getDataStore(name) {
    const store = new Store('abc', {
        cwd: 'data_stores'
    });
    return store;
}

/********* read from Datastore***********/
function readFromDataStore(store, key) {
    return getDataStore(store).get(key);
}

function readFullDataStore(store) {
    return store.get();
}

/********* update Datastore***********/
function updateDataStore(store, key, value) {
    getDataStore(store).set(key, value).save();
}



/********* delete from Datastore***********/
function deleteFromDataStore(store, key) {
    getDataStore(store).del(key).save();
}

exports.readFromDataStore = readFromDataStore;
exports.updateDataStore = updateDataStore;
exports.deleteFromDataStore = deleteFromDataStore;
exports.readFullDataStore = readFullDataStore;