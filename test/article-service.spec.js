const ArticleService = require('../src/article-service')
const knex = require('knex')

describe(`Articles service object`, function() {
    let db
    let testArticles = [
        {
        id: 1,
        date_published: new Date('2029-01-22T16:28:32.615Z'),
        title: 'First test post!',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
        },
        {
        id: 2,
        date_published: new Date('2029-01-22T16:28:32.615Z'),
        title: 'Second test post!',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
        },
        {
        id: 3,
        date_published: new Date('2029-01-22T16:28:32.615Z'),
        title: 'Third test post!',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
        },
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('blogful_articles').truncate())

    afterEach(() => db('blogful_articles').truncate())

    after(() => db.destroy())


    context(`Given 'blogful_articles' has data`, () => {
        beforeEach(() => {
            return db
                .into('blogful_articles')
                .insert(testArticles)
        })

      //it(`resolves all articles from 'blogful_articles' table`, () => {
        it(`getAllArticles() resolves all articles from 'blogful_articles' table`, () => {
          //test that ArticleService.getAllArticles gets data from table
          return ArticleService.getAllArticles(db)
            .then(actual => {
                expect(actual).to.eql(testArticles.map(article => ({
                    ...article,
                    date_published: new Date(article.date_published)
                })))
            })
        })

        it(`getById() resolves an article by id from 'blogful_articles' table`, () => {
            const thirdId = 3
            const thirdTestArticle = testArticles[thirdId - 1]
            return ArticleService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        title: thirdTestArticle.title,
                        content: thirdTestArticle.content,
                        date_published: thirdTestArticle.date_published
                    })
                })
        })

        it(`deleteArticle() removes an article by id from 'blogful_articles' table`, () => {
            const articleId = 3
            return ArticleService.deleteArticle(db, articleId)
                .then(() => ArticleService.getAllArticles(db))
                .then(allArticles => {
                    //copy the test articles array without the "delete" article
                    const expected = testArticles.filter(article => article.id !== articleId)
                    expect(allArticles).to.eql(expected)
                })
        })

        it(`updateArticle() updates an article from the 'blogful_articles' table`, () => {
            const idOfArticleToUpdate = 3
            const newArticleData = {
                title: 'update title',
                content: 'updated content',
                date_published: new Date(),
            }
            return ArticleService.updateArticle(db, idOfArticleToUpdate, newArticleData)
                .then(() => ArticleService.getById(db, idOfArticleToUpdate))
                .then(article => {
                    expect(article).to.eql({
                        id: idOfArticleToUpdate,
                        ...newArticleData,
                    })
                })
        })
    })

    context(`Given 'blogful_articles' has no data`, () => {
        it(`getAllArticles() resolves an empty array`, () => {
            return ArticleService.getAllArticles(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertArticle() inserts a new article and resolves the new article with an 'id'`, () => {
            const newArticle = {
                id: 1,
                title: 'Test new title',
                content: 'Test new content',
                date_published: new Date (),
            }
            return ArticleService.insertArticle(db, newArticle)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        title: newArticle.title,
                        content: newArticle.content,
                        date_published: new Date(newArticle.date_published),
                    })
                })
        })
    })
})

