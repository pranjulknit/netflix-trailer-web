//Constants

const apikey = "0ae2940da0c6552a7808062696c881e4";
const apiEndpoint = "https://api.themoviedb.org/3/";
const imgPath = "https://image.tmdb.org/t/p/original";
const goog = "AIzaSyDvA_SVyln60WrUSyhfk5xScPthxi1YAeI";

const apiPaths = {
  fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
  fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
  fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
  searchOnYoutube: (query) => `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${goog}`
}

// Boots up the app

function init() {
  //   alert('hii your app is up');
  fetchTrendingMovies()
  fetchAndBuildAllSections();
}


async function fetchTrendingMovies() {
  await fetchAndbuildMovieSection(apiPaths.fetchTrending, 'Trending Now')
    .then(list => {
      const randomIndex = parseInt((Math.random() * list.length));
      console.log(randomIndex);
      buildBannerSection(list[randomIndex]);
    }).catch(err => {
      console.error(err);
    })
}




function buildBannerSection(movie) {
  const bannerCont = document.getElementById('banner-section');
  bannerCont.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;
  console.log(bannerCont);
  const div = document.createElement('div');
  var title = movie.title;

  if (typeof title === 'undefined') {
    title = "Movie Name";
  }

  var date = movie.release_date;

  if (typeof date === 'undefined') {
    date = "Released Date";
  }
  div.innerHTML = `
     <h2 class="banner__title">${title}</h2>
     <p class="banner__info">Trending in movies | Released - ${date}</p>
     <p class="banner__overview">${movie.overview}</p>
     <div class="action-buttons-cont">
         <button class="action-button">
             Play
         </button>
         <button class="action-button">
             More Info
         </button>
     </div>
     
     `;
  div.className = "banner-content container";
  bannerCont.append(div);
}





async function searchMovieTrailer(movieName) {
  if (!movieName) return;

  await fetch(apiPaths.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
      console.log(res.items[0]);
      const bestResult = res.items[0];
      // console.log("oh");
      // console.log(res.items[0]);
      const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;

      window.open(youtubeUrl, '_blank');
      console.log(youtubeUrl);
    })
    .catch(err => console.log(err));
}





async function fetchAndBuildAllSections() {
  await fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.slice(0, 6).forEach(category => {
          var name = category.name;
          if (typeof name === 'undefined') {
            name = "Movie Name";
          }
          fetchAndbuildMovieSection(apiPaths.fetchMoviesList(category.id), name);
        })
      }

    })
    .catch(err => console.error(err));
}



async function fetchAndbuildMovieSection(fetchUrl, categoryname) {
  return await fetch(fetchUrl)
    .then(res => res.json())
    .then(res => {
      console.table(res.results);

      const movies = res.results;
      console.table(movies);
      if (Array.isArray(movies) && movies.length) {
        buildMoviesSection(movies, categoryname);
      }
      return movies;
      // console.log("hii");
      // console.log(category.name);
    })
    .catch(err => console.error(err))
}



function buildMoviesSection(list, categoryName) {
  console.log(list, categoryName);
  const moviescont = document.getElementById('movies-cont');

  const moviesListHTML = list.map(item => {
    return `
        <img class="movie-item" src="${imgPath}${item.backdrop_path}" alt="${item.title}" onclick="searchMovieTrailer('${item.title}')">
         `;
  }).join('');

  if (typeof categoryName === 'undefined') {
    categoryName = "Category";
  }
  const moviesSectionHTML = `
      <h2> 
      <h2 class="movie-section-heading"> ${categoryName} <span class="explore-nudge">Explore All</span></h2>
       <div class="movies-row">
       ${moviesListHTML}
        </div>
      
    `;
  console.log("hii");
  console.log(moviesSectionHTML);

  const div = document.createElement('div');
  div.className = "movies-section";
  div.innerHTML = moviesSectionHTML;

  // append html into container

  moviescont.append(div);

}

window.addEventListener('load', function() {
  init();
})