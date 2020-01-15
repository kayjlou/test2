//routes/articleRoutes
const axios = require('axios')
const cheerio = require('cheerio')
const {Article} = require('../models')

module.exports = app => {
  //SCRAPE all articles
  app.get('/scrape', (req, res) =>{
    //SCRAPE into db IF last time stamp is before TODAY.
    let articleArr = []
    scrape(articleArr)
    res.json("Okay")
  })

  //GET all articles
  app.get('/articles', (req, res) =>{
    Article.find()
      .then(articles => {
        //just serve up articles to front end
        console.log(res.json(articles))
        res.json(articles)
      })
      .catch(e => console.error(e))
  })

  //POST one article
  app.post('/articles', (req, res) =>{
    Article.create(req.body)
      .then(()=>{
        //some kinda article logic goes here? -David
        res.sendStatus(200)
      })
      .catch(e => console.error(e))
  })

  //DELETE one article (from SAVED)
  app.delete('/articles/:id', (req, res) =>{
    Article.deleteOne({_id: req.params.id})
    .then(()=>{
      res.sendStatus(200)
    })
    .catch(e=>console.error(e))
  })
}

//CHEERIO SCRAPE LOGIC
const scrape = (articleArr) => {
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~CHEERIO STUFF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  axios.get('https://www.nytimes.com/section/todayspaper#thefrontpage')
  .then(({data: html})=>{
    let titleArr = []
    let summaryArr = []
    let urlArr = []
    const $ = cheerio.load(html)
    console.log('~~~~~~~~~~~~~~~SCRAPE MATERIAL BELOW~~~~~~~~~~~~~~~')
    //titles of articles
    $('div.css-10wtrbd').children('h2').children('a')
      .each((i, elem)=>{
        titleArr.push($(elem).text())
      })

    //summaries of articles
    $('div.css-10wtrbd').children('p.css-1gh531')
      .each((i, elem)=>{
        // console.log($(elem).text())
        summaryArr.push($(elem).text())
      })

    //URLs of articles
    $('div.css-10wtrbd').children('h2').children('a')
      .each((i, elem)=>{
        // console.log("https://www.nytimes.com/" + $(elem).attr('href'))
        urlArr.push("https://www.nytimes.com/" + $(elem).attr('href'))
      })
    
    titleArr.forEach((title, i)=>{
      let article = {title: title, summary: summaryArr[i], url: urlArr[i]}
      articleArr.push(article)
    })
    //PUT ARTICLES IN DB
    articleArr.forEach((article, i)=>{
        Article.create(article)
    })
  })
  .catch(e=>console.error(e))
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~CHEERIO STUFF~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}