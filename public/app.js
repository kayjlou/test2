//GET ARTICLES FROM DB, make cards with "Save" and "Delete" buttons.
const scrapeArticles = () => {
  //GET articles from db.
  axios.get('/scrape')
    .then(({data})=>{
      console.log(data)
      //CREATE CARDS for Articles
    })
    .catch(e=>console.error(e))
}
scrapeArticles()

const getArticles = () => {
  axios.get('/articles')
    .then(({data}) => {
      console.log(data)
      //create cards for articles
      data.forEach((elem, i)=>{
        let articleCard = document.createElement('div')
        articleCard.className = "row"
        articleCard.innerHTML = 
       `<div class="col s12 m6">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">Article #${i + 1}: ${elem.title}</span>
              <p>${elem.summary}</p>
            </div>
            <div class="card-action">
              <a href=${elem.url}>${elem.url}</a>
            </div>
          </div>
        </div>`
        document.getElementById('articles').append(articleCard)
      })
    })
    .catch(e=>console.error(e))
}
setTimeout(() => getArticles(), 1000)