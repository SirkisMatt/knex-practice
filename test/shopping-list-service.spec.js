const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping list service object`, function() {
    let db
    let testItems = [
        {
            item_id: 1,
            name: 'onion',
            price: '3.29',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Main'
        },
        {
            item_id: 2,
            name: 'apple',
            price: '2.99',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Breakfast'
        },
        {
            item_id: 3,
            name: 'banana',
            price: '3.29',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Breakfast'
        },
    ]

    before(() => {
        db = knex ({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db   
                .into('shopping_list')
                .insert(testItems)
        })

        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems.map(item => ({
                        ...item,
                        date_added: new Date(item.date_added)
                    })))
                })
        })

        it(`getByItem_Id() resolves an article by item_id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestItem = testItems[thirdId - 1]
            return ShoppingListService.getByItem_Id(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        item_id: thirdId,
                        name: thirdTestItem.name,
                        price: thirdTestItem.price,
                        date_added: thirdTestItem.date_added,
                        checked: thirdTestItem.checked,
                        category: thirdTestItem.category
                    })
                })
        })

        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const idToDelete = 3
            return ShoppingListService.deleteItem(db, idToDelete)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    const expected = testItems
                        .filter(item => item.item_id !== idToDelete)
                        .map(item => ({
                            ...item,
                            checked: false,
                        }))
                    expect(allItems).to.eql(expected)
                })
        })

        it (`updateItem() updates an item in the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                name: 'updated title',
                price: '99.99',
                date_added: new Date(),
                checked: true,
            }
            const originalItem = testItems[idOfItemToUpdate - 1]
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getByItem_Id(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        item_id: idOfItemToUpdate,
                        ...originalItem,
                        ...newItemData,
                    })
                })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([]);
                })
        })

        it(`insertItem() inserts an item and resolves it with an 'id'`, () => {
            const newItem = {
                name: 'Test new name',
                price: '5.00',
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                checked: true,
                category: 'Lunch'
            }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        item_id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: newItem.date_added,
                        checked: newItem.checked,
                        category: newItem.category,
                    })
                })
        })
    })

})