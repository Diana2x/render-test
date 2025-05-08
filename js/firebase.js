// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// Importar configuración de Firebase desde archivo separado
import { firebaseConfig } from './config.js';

console.log('Iniciando Firebase con configuración:', { 
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  // No logueamos API Keys por seguridad
});

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencia a la colección de películas
const moviesCollection = collection(db, "movies");

// Funciones CRUD para películas
// Crear película
export const createMovie = async (movieData) => {
  try {
    const docRef = await addDoc(moviesCollection, movieData);
    return { id: docRef.id, ...movieData };
  } catch (error) {
    console.error("Error al agregar película:", error);
    throw error;
  }
};

// Obtener todas las películas
export const getAllMovies = async () => {
  try {
    const querySnapshot = await getDocs(moviesCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error al obtener películas:", error);
    throw error;
  }
};

// Obtener una película por ID
export const getMovieById = async (movieId) => {
  try {
    const movieDoc = doc(db, "movies", movieId);
    const docSnap = await getDoc(movieDoc);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error("No se encontró la película");
    }
  } catch (error) {
    console.error("Error al obtener película:", error);
    throw error;
  }
};

// Actualizar película
export const updateMovie = async (movieId, movieData) => {
  try {
    const movieDoc = doc(db, "movies", movieId);
    await updateDoc(movieDoc, movieData);
    return { id: movieId, ...movieData };
  } catch (error) {
    console.error("Error al actualizar película:", error);
    throw error;
  }
};

// Eliminar película
export const deleteMovie = async (movieId) => {
  try {
    const movieDoc = doc(db, "movies", movieId);
    await deleteDoc(movieDoc);
    return movieId;
  } catch (error) {
    console.error("Error al eliminar película:", error);
    throw error;
  }
};

// Filtrar películas por género
export const filterMoviesByGenre = async (genre) => {
  try {
    const q = query(moviesCollection, where("genre", "==", genre));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error al filtrar películas por género:", error);
    throw error;
  }
};

// Filtrar películas por año
export const filterMoviesByYear = async (year) => {
  try {
    const q = query(moviesCollection, where("year", "==", parseInt(year)));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error al filtrar películas por año:", error);
    throw error;
  }
};

// Ordenar películas
export const sortMovies = async (field) => {
  try {
    const q = query(moviesCollection, orderBy(field));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error al ordenar películas:", error);
    throw error;
  }
};

export { db };
