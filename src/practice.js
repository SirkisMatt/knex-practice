require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection:process.env.DB_URL ,
})


function searchByProductName(searchTerm) {
    knexInstance    
        .select('product_id', 'name', 'price', 'category')
        .from('amazong_products')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(results => {
            console.log(results)
        })
}

searchByProductName('holo')

function paginateProducts(page) {
    const productsPerPage = 10
    const offset = productsPerPage * (page - 1)
    knexInstance 
        .select('product_id', 'name', 'price', 'category')
        .from('amazong_products')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

paginateProducts(2)

function getProductWithImages() {
    knexInstance    
        .select('product_id', 'name', 'price', 'category', 'image')
        .from('amazong_products')
        .whereNotNull('image')
        .then(result => {
            console.log(result)
        })
}

getProductWithImages()

function mostPopularVideosForDays(days) {
    knexInstance
        .select('video_name', 'region')
        .count('date_viewed AS views')
        .where(
            'date_viewed',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
        )
        .from('whopipe_video_views')
        .groupBy('video_name', 'region')
        .orderBy([
            { column: 'region', order: 'ASC' },
            { column: 'views', order: 'DECS' }
        ])
        .then(result => {
            console.log(result)
        })
}

mostPopularVideosForDays(30)