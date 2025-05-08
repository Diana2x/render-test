// Importar las funciones de Firebase
import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  filterMoviesByGenre,
  filterMoviesByYear,
  sortMovies
} from './firebase.js';

// Elementos del DOM
const moviesContainer = document.getElementById('moviesContainer');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const genreFilter = document.getElementById('genreFilter');
const yearFilter = document.getElementById('yearFilter');
const sortBySelect = document.getElementById('sortBy');
const addMovieForm = document.getElementById('addMovieForm');
const movieIdInput = document.getElementById('movieId');
const titleInput = document.getElementById('title');
const directorInput = document.getElementById('director');
const yearInput = document.getElementById('year');
const durationInput = document.getElementById('duration');
const ratingInput = document.getElementById('rating');
const genreInput = document.getElementById('genre');
const posterUrlInput = document.getElementById('posterUrl');
const synopsisInput = document.getElementById('synopsis');
const saveButton = document.getElementById('saveButton');
const resetButton = document.getElementById('resetButton');
const alertContainer = document.getElementById('alertContainer');
const formAlertContainer = document.getElementById('formAlertContainer');
const movieDetailContent = document.getElementById('movieDetailContent');
const editMovieBtn = document.getElementById('editMovieBtn');
const deleteMovieBtn = document.getElementById('deleteMovieBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Inicializar modales de Bootstrap
const movieDetailModal = new bootstrap.Modal(document.getElementById('movieDetailModal'));
const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));

// Variable para almacenar la película seleccionada actualmente
let currentMovie = null;
// Variable para almacenar todas las películas
let allMovies = [];

// Función para cargar todas las películas
const loadMovies = async () => {
  try {
    moviesContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-light" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Cargando películas...</p>
      </div>
    `;
    
    allMovies = await getAllMovies();
    renderMovies(allMovies);
  } catch (error) {
    showAlert(alertContainer, 'Error al cargar películas', 'danger');
    console.error('Error al cargar películas:', error);
  }
};

// Función para renderizar la lista de películas
const renderMovies = (movies) => {
  if (movies.length === 0) {
    moviesContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-film fa-3x mb-3"></i>
        <h3>No se encontraron películas</h3>
        <p>Agrega una nueva película o modifica tus filtros de búsqueda.</p>
      </div>
    `;
    return;
  }

  moviesContainer.innerHTML = movies.map(movie => `
    <div class="col-md-4 col-sm-6 mb-4">
      <div class="movie-card h-100">
        <img src="${movie.posterUrl || 'https://via.placeholder.com/300x450?text=Sin+Imagen'}" 
             alt="${movie.title}" 
             class="movie-poster">
        <div class="card-body p-3">
          <h5 class="card-title">${movie.title} (${movie.year})</h5>
          <p class="card-text mb-1">
            <i class="fas fa-star text-warning"></i> ${movie.rating}/10
          </p>
          <p class="card-text"><small>${movie.genre}</small></p>
          <button class="btn btn-primary btn-sm w-100" 
                  onclick="viewMovieDetails('${movie.id}')">
            <i class="fas fa-eye"></i> Ver detalles
          </button>
        </div>
      </div>
    </div>
  `).join('');
};

// Función para ver detalles de una película
window.viewMovieDetails = async (movieId) => {
  try {
    const movie = await getMovieById(movieId);
    currentMovie = movie;
    
    movieDetailContent.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <img src="${movie.posterUrl || 'https://via.placeholder.com/300x450?text=Sin+Imagen'}" 
               alt="${movie.title}" 
               class="img-fluid rounded">
        </div>
        <div class="col-md-8">
          <h3>${movie.title} <span class="badge bg-secondary">${movie.year}</span></h3>
          <p><strong>Director:</strong> ${movie.director}</p>
          <p><strong>Género:</strong> ${movie.genre}</p>
          <p><strong>Duración:</strong> ${movie.duration} minutos</p>
          <p><strong>Calificación:</strong> <i class="fas fa-star text-warning"></i> ${movie.rating}/10</p>
          <h5>Sinopsis:</h5>
          <p>${movie.synopsis}</p>
        </div>
      </div>
    `;
    
    movieDetailModal.show();
  } catch (error) {
    showAlert(alertContainer, 'Error al cargar los detalles de la película', 'danger');
    console.error('Error al cargar los detalles:', error);
  }
};

// Función para llenar el formulario con datos para editar
const fillFormForEdit = (movie) => {
  movieIdInput.value = movie.id;
  titleInput.value = movie.title;
  directorInput.value = movie.director;
  yearInput.value = movie.year;
  durationInput.value = movie.duration;
  ratingInput.value = movie.rating;
  genreInput.value = movie.genre;
  posterUrlInput.value = movie.posterUrl;
  synopsisInput.value = movie.synopsis;
  
  // Cambiar el texto del botón
  saveButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Película';
  
  // Activar pestaña de formulario
  document.getElementById('agregar-tab').click();
};

// Evento para editar película
editMovieBtn.addEventListener('click', () => {
  if (currentMovie) {
    fillFormForEdit(currentMovie);
    movieDetailModal.hide();
  }
});

// Evento para confirmar eliminación
deleteMovieBtn.addEventListener('click', () => {
  if (currentMovie) {
    movieDetailModal.hide();
    deleteConfirmModal.show();
  }
});

// Evento para eliminar película
confirmDeleteBtn.addEventListener('click', async () => {
  try {
    await deleteMovie(currentMovie.id);
    deleteConfirmModal.hide();
    showAlert(alertContainer, 'Película eliminada con éxito', 'success');
    loadMovies();
  } catch (error) {
    showAlert(alertContainer, 'Error al eliminar la película', 'danger');
    console.error('Error al eliminar:', error);
  }
});

// Función para mostrar alertas
const showAlert = (container, message, type) => {
  container.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  
  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    const alert = container.querySelector('.alert');
    if (alert) {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }
  }, 5000);
};

// Evento para buscar películas
searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.toLowerCase().trim();
  if (searchTerm === '') {
    renderMovies(allMovies);
    return;
  }
  
  const filteredMovies = allMovies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm) || 
    movie.director.toLowerCase().includes(searchTerm) || 
    movie.synopsis.toLowerCase().includes(searchTerm)
  );
  
  renderMovies(filteredMovies);
});

// También buscar al presionar Enter
searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    searchButton.click();
  }
});

// Eventos para filtrar películas
genreFilter.addEventListener('change', async () => {
  const selectedGenre = genreFilter.value;
  
  if (selectedGenre === '') {
    renderMovies(allMovies);
    return;
  }
  
  try {
    const filteredMovies = await filterMoviesByGenre(selectedGenre);
    renderMovies(filteredMovies);
  } catch (error) {
    showAlert(alertContainer, 'Error al filtrar por género', 'danger');
    console.error('Error al filtrar por género:', error);
  }
});

yearFilter.addEventListener('change', async () => {
  const selectedYear = yearFilter.value;
  
  if (selectedYear === '') {
    renderMovies(allMovies);
    return;
  }
  
  try {
    let filteredMovies = [];
    
    // Manejar rangos de años
    if (selectedYear === '2010s') {
      filteredMovies = allMovies.filter(movie => movie.year >= 2010 && movie.year <= 2019);
    } else if (selectedYear === '2000s') {
      filteredMovies = allMovies.filter(movie => movie.year >= 2000 && movie.year <= 2009);
    } else if (selectedYear === 'older') {
      filteredMovies = allMovies.filter(movie => movie.year < 2000);
    } else {
      filteredMovies = await filterMoviesByYear(selectedYear);
    }
    
    renderMovies(filteredMovies);
  } catch (error) {
    showAlert(alertContainer, 'Error al filtrar por año', 'danger');
    console.error('Error al filtrar por año:', error);
  }
});

// Evento para ordenar películas
sortBySelect.addEventListener('change', async () => {
  const sortField = sortBySelect.value;
  
  try {
    const sortedMovies = await sortMovies(sortField);
    renderMovies(sortedMovies);
  } catch (error) {
    showAlert(alertContainer, 'Error al ordenar películas', 'danger');
    console.error('Error al ordenar películas:', error);
  }
});

// Evento para el formulario de agregar/editar película
addMovieForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const movieData = {
    title: titleInput.value,
    director: directorInput.value,
    year: parseInt(yearInput.value),
    duration: parseInt(durationInput.value),
    rating: parseFloat(ratingInput.value),
    genre: genreInput.value,
    posterUrl: posterUrlInput.value,
    synopsis: synopsisInput.value
  };
  
  try {
    const movieId = movieIdInput.value;
    
    if (movieId) {
      // Actualizar película existente
      await updateMovie(movieId, movieData);
      showAlert(formAlertContainer, 'Película actualizada con éxito', 'success');
    } else {
      // Crear nueva película
      await createMovie(movieData);
      showAlert(formAlertContainer, 'Película agregada con éxito', 'success');
    }
    
    // Resetear formulario y recargar películas
    resetForm();
    loadMovies();
    
    // Cambiar a la pestaña de películas después de guardar
    document.getElementById('peliculas-tab').click();
  } catch (error) {
    showAlert(formAlertContainer, 'Error al guardar la película', 'danger');
    console.error('Error al guardar:', error);
  }
});

// Evento para resetear el formulario
resetButton.addEventListener('click', () => {
  resetForm();
});

// Función para resetear el formulario
const resetForm = () => {
  addMovieForm.reset();
  movieIdInput.value = '';
  saveButton.innerHTML = '<i class="fas fa-save"></i> Guardar Película';
};

// Cargar películas al iniciar
window.addEventListener('DOMContentLoaded', () => {
  loadMovies();
});
