const ShoppingListService = {
    getAllItems(knex) {
        return knex.select('*').from('shopping_list')
    },
    getByItem_Id(knex, item_id) {
        return knex.from('shopping_list').select('*').where('item_id', item_id).first()
    },
    deleteItem(knex, item_id) {
        return knex('shopping_list')
            .where({ item_id })
            .delete();
    },
    updateItem(knex, item_id, newItemFields) {
        return knex('shopping_list')
            .where({ item_id })
            .update(newItemFields)
    },
    insertItem(knex, newItem) {
        return knex
            .insert(newItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => rows[0])
    }
}

module.exports = ShoppingListService