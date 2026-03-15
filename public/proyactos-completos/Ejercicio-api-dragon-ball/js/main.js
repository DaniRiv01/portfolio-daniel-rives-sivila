/*
    



    Perdón si hay mucho tailwind pero he aprovechado para practicarlo
    (Odio el diseño y el diseñar)



    Si ves que en las clases pongo saltos de línea es para poder verlas
    mejor y no tener que estar de izquierda a derecha







*/

async function cargarPersonajes() {
    const RUTA_API = "https://dragonball-api.com/api/characters?limit=200";
    let personajes = [];
    const divPersonajes = document.querySelector("#personajes");

    try {
        // Trae de la API solo los nombres de lo que podemos traernos
        const PAQUETE_API = await fetch(RUTA_API);

        // Por si falla por cualquier cosa el traer los nombres
        if (!PAQUETE_API.ok) {
            throw new Error(`Error HTTP: ${PAQUETE_API.status}`);
        }
        // Traemos el json que se referencia donde ya se encuenrtran los personajes
        const JSON_API = await PAQUETE_API.json();
        personajes = JSON_API.items;
        console.log(personajes);
    } catch (e) {
        console.error("No se ha podido cargar la información de la API:", e);
        divPersonajes.innerHTML = `<p class="text-red-500 text-center col-span-full">Error al cargar los personajes. Inténtalo de nuevo más tarde.</p>`;
        return;
    }

    // Vaciamos el grid por si hubiera algo
    divPersonajes.innerHTML = "";

    // Aquí ya empieza a rellenar el grid de cards pochas con los datos de los personajes
    personajes.forEach(personaje => {
        let card = document.createElement("div");
        card.classList.add(
            "card-container",
            "bg-gray-800",
            "bg-opacity-80",
            "backdrop-blur-md",
            "rounded-xl",
            "overflow-hidden",
            "shadow-xl",
            "transform",
            "transition",
            "duration-300",
            "hover:shadow-2xl",
            "hover:scale-[1.02]",
            "cursor-pointer",
            "flex",
            "flex-col"
        );

        let imgContainer = document.createElement("div");
        imgContainer.classList.add(
            "card-image-container",
            "h-[300px]",
            "flex",
            "justify-center",
            "items-center",
            "p-4",
            "bg-gray-800",
        );

        let img = document.createElement("img");
        img.src = personaje.image;
        img.alt = `Imagen de ${personaje.name}`;
        img.classList.add(
            "card-image",
            "max-w-full",
            "max-h-full",
            "object-contain"
        );
        imgContainer.appendChild(img);

        let descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add(
            "p-4",
            "flex-grow",
            "flex",
            "flex-col"
        );

        let name = document.createElement("h2");
        name.textContent = personaje.name;
        name.classList.add(
            "text-2xl",
            "font-bold",
            "text-yellow-400",
            "mb-2",
            "truncate"
        );

        let subInfo = document.createElement("p");
        subInfo.innerHTML = `
            <span class="text-sm font-semibold text-gray-400">Raza:</span> ${personaje.race} | 
            <span class="text-sm font-semibold text-gray-400">Afiliación:</span> ${personaje.affiliation}
        `;
        subInfo.classList.add("text-sm", "text-gray-300", "mb-3");

        let button = document.createElement("button");
        button.textContent = "Ver Detalles";
        button.classList.add(
            "w-full",
            "py-2",
            "mt-2",
            "bg-orange-600",
            "hover:bg-orange-700",
            "text-white",
            "font-bold",
            "rounded-lg",
            "transition",
            "duration-200"
        );

        // Para enseñar en un modal todos los datos que traía el json del personaje actualmente iterado
        button.addEventListener("click", () => {
            mostrarModal(personaje);
        });

        descriptionDiv.appendChild(name);
        descriptionDiv.appendChild(subInfo);
        descriptionDiv.appendChild(button);

        card.appendChild(imgContainer);
        card.appendChild(descriptionDiv);

        divPersonajes.appendChild(card);
    });
}

// Que gracioso estuvo hacer el modal de mierda, sobretodo rellenarlo con los datos
function mostrarModal(personaje) {
    const overlay = document.createElement("div");
    overlay.classList.add(
        "fixed",
        // inset-0 Es para que el overlay ocupe la pantalla entera y no deje ningún margen. 
        // Debe ir por cojones con el fixed o absolute
        "inset-0",
        "bg-black",
        "bg-opacity-75",
        "flex",
        "justify-center",
        "items-center",
        "z-50"
    );
    // Una mickey-herramienta que hará que no me pegue un tiro en los cojones mas tarde.
    overlay.id = "personaje-modal-overlay";

    // El div que va a contener los datos del personaje que se pasa por parametro.
    const modalContent = document.createElement("div");
    modalContent.classList.add(
        "bg-gray-800",
        "rounded-xl",
        "shadow-2xl",
        "p-6",
        "w-11/12",
        "md:w-3/4",
        "lg:w-1/2",
        "max-h-[90vh]",
        // En caso de que la infomación se desborde a los 90vh, se ocultará el sobrante de 
        // información y aparecerá un scroll para poder verla
        "overflow-y-auto",
        // Le decimos que sus hijos lo van a tener de referencia en caso de que se use absolute o fixed
        "relative"
    );

    // Un botón para cerrar el modal
    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.classList.add(
        "absolute",
        "top-4",
        "right-4",
        "text-2xl",
        "text-orange-400",
        "hover:text-orange-500",
        "font-bold"
    );
    closeButton.onclick = () => {
        document.body.removeChild(overlay);
    };

    // Te acuerdas de la mickey-herramienta? 
    // Pues sirve para diferenciar el overlay del modal a la hora de hacer click

    // Lo que ocurría en una versión anterior es que al hacer click en cualquier sitio (incluso en el propio modal) 
    // se cerraba. 

    // Lo que hace ahora es que solo se cerrará cuando cliques solo en el overlay (O en la X del modal como se hace en
    // la función de arriba)
    overlay.onclick = (e) => {
        if (e.target.id === "personaje-modal-overlay") {
            document.body.removeChild(overlay);
        }
    };

    // Aquí no va en coña que tuve que hacerme un html aparte para no rallarme por el color naranja
    // No hay mucho que decir aquí, es una card del personaje de turno pero más extensa.
    // Lo podría haber hecho full JS? Si.
    // Me daba una pereza histórica? También. Quería cambiar un poco xd
    modalContent.innerHTML = `
        <h2 class="text-4xl text-orange-500 mb-4 text-center border-b-2 border-gray-500" style="font-family: Saiyan-Sans;">
            ${personaje.name}
        </h2>
        
        <div class="flex flex-col md:flex-row gap-6">
            <div class="md:w-1/3 flex justify-center items-center p-2 bg-gray-950 rounded-lg h-64 md:h-auto">
                <img src="${personaje.image}" alt="${personaje.name}" class="max-w-full max-h-full object-contain md:max-h-96">
            </div>

            <div class="md:w-2/3">
                <p class="text-gray-300 text-base leading-relaxed mb-4">
                    ${personaje.description}
                </p>
                
                <div class="grid grid-cols-2 gap-2 text-sm mb-4">
                    <p class="text-gray-400 font-semibold">Raza:</p>
                    <p class="text-gray-100">${personaje.race}</p>

                    <p class="text-gray-400 font-semibold">Afiliación:</p>
                    <p class="text-gray-100">${personaje.affiliation}</p>

                    <p class="text-gray-400 font-semibold">Género:</p>
                    <p class="text-gray-100">${personaje.gender}</p>

                    <p class="text-gray-400 font-semibold">Ki (Inicial):</p>
                    <p class="text-yellow-300 font-mono">${personaje.ki}</p>
                    
                    <p class="text-gray-400 font-semibold">Ki (Máximo):</p>
                    <p class="text-yellow-300 font-mono">${personaje.maxKi}</p>
                </div>
            </div>
        </div>
    `;

    // Sé que los comentarios no se hacen así pero yo que sé, esto no creo que lo vea mucha gente (No debería de verlo nadie)

    modalContent.appendChild(closeButton);
    overlay.appendChild(modalContent);

    document.body.appendChild(overlay);
}

document.addEventListener("DOMContentLoaded", () => {
    cargarPersonajes();
});