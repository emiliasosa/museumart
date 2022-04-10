setTimeout(function(){
    $('#borrar').remove();
  }, 1500)


//Redireccionar desde boton home
const redirect = () =>{
    window.location.href = "art.html";
}

//Mostrar Cards en pagina Art
const requestInfo = async ()=>{
    const result = await fetch("https://api.artic.edu/api/v1/artworks?limit=50")
    const conversion = await result.json()
    const show = document.getElementById("main__showAll")

    for(let info of conversion.data){
        const {id, title, image_id} = info
        
        if(title != "Untitled" && title.length < 50 && image_id != null){
            show.innerHTML =  show.innerHTML + `
            <div class="main__card">
                <div class="main__card__txt">
                    <h3 class="main__card__ttl">${title}</h3>
                   <p class="main__card__info" id="${id}" onclick="redirectOneArt(${id})">+ + SEE MORE</p>
                </div>
                <div class="main__card__container__img">
                    <img class="main__card__img"src="https://www.artic.edu/iiif/2/${image_id}/full/full/0/default.jpg" alt="">
                </div>
            </div>`
        }

    }
    sliderBtn()
}

//Funcionalidad del boton para mover las cards
let sliderBtn = ()=>{
    const slider = document.getElementById("main__showAll");
    let sliderSection = document.getElementsByClassName("main__card");
    
    const btnLeft = document.getElementById("main__btn__left");
    const btnRight = document.getElementById("main__btn__right");

    slider.insertAdjacentElement("afterbegin", sliderSection[sliderSection.length -1])

    let sliderFunction = (margin, position, section)=>{
        slider.style.marginLeft = margin;
        slider.style.transition = "all 0.5s";

        setTimeout(()=>{
            slider.style.transition = "none";
            slider.insertAdjacentElement(position, section)
            slider.style.marginLeft = "-23.6vw";
        }, 500);
    }

    btnRight.addEventListener('click', ()=>{sliderFunction("-48vw", "beforeend", sliderSection[0])})
    btnLeft.addEventListener('click', ()=>{sliderFunction("0.7vw", "afterbegin", sliderSection[sliderSection.length -1])})
}

//Tomar informacion y filtrar por id para mostrar solo uno
const redirectOneArt = async (id) =>{
    const result = await fetch("https://api.artic.edu/api/v1/artworks?limit=50")
    const conversion = await result.json()
    const idOne = id
    const positionOnObject = conversion.data.findIndex(el => el.id == idOne)
    localStorage.setItem('Position', JSON.stringify(positionOnObject));
    
    for(let info of conversion.data){
        const {id:idArt, title, image_id, date_start, date_end,dimensions,artist_title, place_of_origin,medium_display, 
            credit_line, artwork_type_title,material_titles} = info
            
        if(idArt == idOne){
            let oneArray = {title: title, image_id: image_id, date_start:date_start, date_end:date_end, 
                dimensions:dimensions, artist_title:artist_title, place_of_origin:place_of_origin,medium_display:medium_display,
                credit_line: credit_line, artwork_type_title: artwork_type_title, material_titles:material_titles}
                
            localStorage.setItem('OneArt', JSON.stringify(oneArray));

            showOne()
        }
    }
}

//Verificacion de valores en value y mostrar en ventana modal
let showOne = ()=>{
    const show = document.getElementById("main__oneContainer")
    show.style.visibility = 'visible' 

    let preventUndefined = (value)=>{
        if(value == undefined || value == null || value.length == 0){
            return `<p class="description__p--error">Information not available</p>`
        }else{
            return value
        }
    }


    let oneArtRequest = localStorage.getItem('OneArt')
    let {title, image_id, date_start, date_end,dimensions,artist_title, place_of_origin,medium_display, 
        credit_line, artwork_type_title,material_titles} = JSON.parse(oneArtRequest)
    let splitMaterials = material_titles.join(", ")
    let upperCaseMaterials = splitMaterials.charAt(0).toUpperCase() + splitMaterials.slice(1)
    
    show.innerHTML = `
            <div class="oneContainer__container__img">
                <div class="oneContainer__img">
                    <img id="one__img" class="img" src="https://www.artic.edu/iiif/2/${image_id}/full/full/0/default.jpg" alt="">
                </div>
            </div>
            <div class="oneContainer__container__decription">
                <h3 class="description__ttl">${title}</h3>
                <p class="description__p">Artist</p>
                <p class="description__p--info">${preventUndefined(artist_title)}</p>
                <p class="description__p">Materials</p>
                <p class="description__p--info">${preventUndefined(upperCaseMaterials)}</p>
                <p class="description__p">Date Start - Date End</p>
                <p class="description__p--info">${preventUndefined(date_start)} - ${preventUndefined(date_end)}</p>
                <p class="description__p">Artwork type</p>
                <p class="description__p--info">${preventUndefined(artwork_type_title)}</p>
                <p class="description__p">Dimensions</p>
                <p class="description__p--info">${preventUndefined(dimensions)}</p>
                <p class="description__p">Place of origin</p>
                <p class="description__p--info">${preventUndefined(place_of_origin)}</p>
                <p class="description__p">Display</p>
                <p class="description__p--info">${preventUndefined(medium_display)}</p>
                <p class="description__p">Credits</p>
                <p class="description__p--info">${preventUndefined(credit_line)}</p>
                <div class="main__oneContainer__btn" id="oneContainer__btn" style="font-family: Arial, Helvetica, sans-serif;">&#120</div>
            </div>`;


    let displayOneImg = ()=>{
        const show = document.getElementById("main__oneContainer__imgDisplay")
        show.style.visibility = 'visible' 

        show.innerHTML = `
            <div class="oneContainer__container__img--display" >
                <div class="oneContainer__img--display">
                    <img class="img--display" id="img--display" src="https://www.artic.edu/iiif/2/${image_id}/full/full/0/default.jpg" alt="">
                </div>
            </div>`
    }

    const showOneImg = document.getElementById("one__img")
    showOneImg.addEventListener('click', ()=>{displayOneImg()})

    btnBack("oneContainer__btn", "main__oneContainer", "main__oneContainer__imgDisplay")
    btnBack("main__oneContainer__imgDisplay", "main__oneContainer__imgDisplay")
}

//Ocultar ventanas modal
let btnBack = (idEvent, idContenedor, idContenedor2)=>{
    let showEvent = document.getElementById(idEvent)
    let showHidden = document.getElementById(idContenedor)
    let extraHidden = document.getElementById(idContenedor2)

    showEvent.addEventListener('click', ()=>{
        showHidden.style.visibility = 'hidden' 
        extraHidden.style.visibility = 'hidden' 
    }
)}

requestInfo()
