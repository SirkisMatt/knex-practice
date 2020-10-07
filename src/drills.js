require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})


// function searchByItemName(searchTerm) {
//     knexInstance
//         .select('item_id', 'name', 'price', 'checked', 'category')
//         .from('shopping_list')
//         .where('name', 'ILIKE', `%${searchTerm}%`)
//         .then(result => {
//             console.log(result)
//         })
// }

// searchByItemName('a')

// function paginateItems(page) {
//     const itemsPerPage = 6
//     const offset = itemsPerPage * (page - 1)
//     knexInstance
//         .select('item_id', 'name', 'price', 'checked', 'category')
//         .from('shopping_list')
//         .limit(itemsPerPage)
//         .offset(offset)
//         .then(result => {
//             console.log(result)
//         })
// }

// paginateItems(2)

// function itemsAddedAfter (daysAgo) {
//     knexInstance
//         .select('item_id', 'name', 'price', 'checked')
//         .count('date_added')
//         .where(
//             'date_added',
//             '>',
//             knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
//         )
//         .from('shopping_list')
//         .groupBy('item_id', 'name', 'price', 'checked')
//         .then(results => {
//             console.log(results)
//         })
// }
// itemsAddedAfter(7)

function totalCost() {
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then(results => {
            console.log(results)
        })

}

totalCost()