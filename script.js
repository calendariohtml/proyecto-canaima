// PROYECTO CANAIMA - NAVEGACIÓN Y EFECTOS

const vistas = {
  inicio: document.getElementById("inicio"),
  fase1: document.getElementById("fase1"),
  fase2: document.getElementById("fase2"),
  fase3: document.getElementById("fase3"),
  mapa: document.getElementById("mapa")
};

const enlacesMenu = document.querySelectorAll(".menu a");
const menu = document.querySelector(".menu");
const menuToggle = document.querySelector(".menu-toggle");

function actualizarVista(nombre, actualizarDireccion = true) {
  if (!vistas[nombre]) nombre = "inicio";

  Object.values(vistas).forEach(vista => vista.classList.remove("vista-activa"));
  vistas[nombre].classList.add("vista-activa");

  enlacesMenu.forEach(enlace => {
    enlace.classList.toggle("enlace-activo", enlace.dataset.go === nombre);
  });

  document.body.classList.toggle("pagina-interna", nombre !== "inicio");

  if (menu) menu.classList.remove("menu-abierto");
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");

  window.scrollTo({ top: 0, behavior: "smooth" });

  // Reiniciar las animaciones de aparición de la pantalla seleccionada
  observarElementos(vistas[nombre]);

  if (actualizarDireccion && window.location.hash !== "#" + nombre) {
    history.pushState({ vista: nombre }, "", "#" + nombre);
  }
}

document.querySelectorAll("[data-go]").forEach(elemento => {
  elemento.addEventListener("click", evento => {
    evento.preventDefault();
    actualizarVista(elemento.dataset.go);
  });
});

window.addEventListener("popstate", () => {
  const nombre = window.location.hash.slice(1) || "inicio";
  actualizarVista(nombre, false);
});

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const abierto = menu.classList.toggle("menu-abierto");
    menuToggle.setAttribute("aria-expanded", String(abierto));
  });
}

// GALERÍAS
const fotografias = {
  comunidad: [
    { archivo: "imagenes/calle_principal.jpeg", titulo: "Calle principal", descripcion: "Vista de una de las vías de acceso de la comunidad." },
    { archivo: "imagenes/calle_araguaney.jpeg", titulo: "Calle Araguaney", descripcion: "Registro fotográfico de la calle Araguaney." },
    { archivo: "imagenes/calle_esperanza.jpeg", titulo: "Calle La Esperanza", descripcion: "Espacio que forma parte de la distribución vial del sector." },
    { archivo: "imagenes/calle_la_rosa.png", titulo: "Calle La Rosa", descripcion: "Fotografía de una de las calles de Brisas de las Mercedes." },
    { archivo: "imagenes/calle_orquideas.jpeg", titulo: "Calle La Orquídea", descripcion: "Vista de la calle La Orquídea." },
    { archivo: "imagenes/calle_primavera.jpeg", titulo: "Calle Primavera", descripcion: "Registro de la calle Primavera, perteneciente a la comunidad." }
  ],
  diagnostico: [
    { archivo: "imagenes/dos_computadoras.jpeg", titulo: "Dos equipos Canaima", descripcion: "Computadoras portátiles seleccionadas para la evaluación técnica." }
  ],
  ejecucion: [
    { archivo: "imagenes/mantenimiento.jpeg", titulo: "Mantenimiento técnico", descripcion: "Proceso de revisión, desmontaje y limpieza de los equipos." },
    { archivo: "imagenes/computadora_encendida.jpg", titulo: "Equipo recuperado", descripcion: "Computadora encendida después de la intervención técnica." }
  ]
};

document.querySelectorAll("[data-carousel]").forEach(carrusel => {
  const lista = fotografias[carrusel.dataset.carousel];
  if (!lista || !lista.length) return;

  const imagen = carrusel.querySelector("[data-carousel-image]");
  const titulo = carrusel.querySelector("[data-carousel-title]");
  const descripcion = carrusel.querySelector("[data-carousel-description]");
  const contador = carrusel.querySelector("[data-carousel-counter]");
  const puntos = carrusel.querySelector("[data-carousel-dots]");
  const anterior = carrusel.querySelector("[data-carousel-prev]");
  const siguiente = carrusel.querySelector("[data-carousel-next]");

  let indice = 0;
  let temporizador = null;

  lista.forEach((foto, posicion) => {
    const punto = document.createElement("button");
    punto.className = "punto";
    punto.type = "button";
    punto.setAttribute("aria-label", `Mostrar fotografía ${posicion + 1}`);
    punto.addEventListener("click", () => {
      mostrarFotografia(posicion);
      reiniciarTemporizador();
    });
    puntos.appendChild(punto);
  });

  const botonesPuntos = puntos.querySelectorAll(".punto");

  function mostrarFotografia(nuevoIndice) {
    indice = (nuevoIndice + lista.length) % lista.length;
    const foto = lista[indice];

    imagen.style.opacity = "0";
    window.setTimeout(() => {
      imagen.src = foto.archivo;
      imagen.alt = foto.titulo;
      titulo.textContent = foto.titulo;
      descripcion.textContent = foto.descripcion;
      contador.textContent = `${indice + 1} / ${lista.length}`;
      botonesPuntos.forEach((punto, posicion) => {
        punto.classList.toggle("activo", posicion === indice);
      });
      imagen.style.opacity = "1";
    }, 140);
  }

  anterior.addEventListener("click", () => {
    mostrarFotografia(indice - 1);
    reiniciarTemporizador();
  });
  siguiente.addEventListener("click", () => {
    mostrarFotografia(indice + 1);
    reiniciarTemporizador();
  });

  function detenerTemporizador() {
    if (temporizador) {
      clearInterval(temporizador);
      temporizador = null;
    }
  }

  function iniciarTemporizador() {
    detenerTemporizador();
    if (lista.length > 1 && !document.hidden) {
      temporizador = setInterval(() => mostrarFotografia(indice + 1), 6000);
    }
  }

  function reiniciarTemporizador() {
    iniciarTemporizador();
  }

  carrusel.addEventListener("mouseenter", detenerTemporizador);
  carrusel.addEventListener("mouseleave", iniciarTemporizador);
  document.addEventListener("visibilitychange", iniciarTemporizador);

  mostrarFotografia(0);
  iniciarTemporizador();
});

// BRILLO MUY SUTIL QUE ACOMPAÑA EL MOUSE (solo escritorio)
const cursorGlow = document.querySelector(".cursor-glow");
if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("pointermove", evento => {
    cursorGlow.style.left = evento.clientX + "px";
    cursorGlow.style.top = evento.clientY + "px";
    document.body.classList.add("cursor-activo");
  });
  document.addEventListener("pointerleave", () => {
    document.body.classList.remove("cursor-activo");
  });
}

// APARICIÓN SUAVE DE LOS ELEMENTOS AL ENTRAR EN PANTALLA
let observador = null;

function observarElementos(contenedor = document) {
  if (!("IntersectionObserver" in window)) {
    contenedor.querySelectorAll(".reveal").forEach(elemento => elemento.classList.add("visible"));
    return;
  }

  if (observador) observador.disconnect();

  observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        obs.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  contenedor.querySelectorAll(".reveal").forEach(elemento => {
    elemento.classList.remove("visible");
    observador.observe(elemento);
  });
}

// VISTA INICIAL: permite abrir directamente un enlace como #fase2
const vistaInicial = window.location.hash.slice(1) || "inicio";
actualizarVista(vistaInicial, false);
