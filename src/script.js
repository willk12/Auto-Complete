let searchInput = document.getElementById('search');
let autoComplet = document.getElementById('container');
let token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTBjZDIyMjcxMjIyNWY1MzliZmU1NTM1MzRmZTJlZSIsIm5iZiI6MTcyNjg0Mjg5Mi43MTM3NTYsInN1YiI6IjY2ZDI0ZDg2NjVlOGI0ZmZmOGFkZjQ2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DUXDrcSiAHTUe58tn11rojmWXDU9mBYwFdsXFHcjfLA';

searchInput.addEventListener('focusin', (e)=>{

    if(autoComplet.textContent.length == 0 || e.target.value.length == 0 ){
        autoComplet.innerHTML = "Nothing here"
    }
 })

//  autoComplet.addEventListener('mouseout', (e)=>{
//     e.target.style.display = 'none'
//  })



searchInput.addEventListener('input', _.throttle(async event => {
  try {
    if (event.target.value.length === 0) {
      autoComplet.style.display = 'flex';
      autoComplet.innerHTML = '<span id="notFound">Not Found</span>';
      return;
    }

    if (event.target.value.length >= 2) {
      const response = await axios.get('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data.results;

      console.log(data)

      if (!data.length) {
        autoComplet.style.display = 'flex';
        autoComplet.innerHTML = '<span id="notFound">Not Found</span>';
        return;
      }

      const filteredNames = data.filter(person => 
        person.original_title.toLowerCase().includes(event.target.value.toLowerCase())
      );

      autoComplet.style.display = 'flex';

      let nameFound = '<ul>';
      nameFound += filteredNames.map(person => {
        return `<li>${person.original_title}
        <img src="https://image.tmdb.org/t/p/w500${person.backdrop_path}"></li>`; 
      }).join('');
      nameFound += '</ul>';

      autoComplet.innerHTML = nameFound;
    }
  } catch (error) {
    console.log(error);
  }
}, 500));
