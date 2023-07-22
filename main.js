//rendering a random number of page
var random_page = Math.floor(Math.random()*60)+1;


// Saving url paths for fetching API
const url_artworks = `https://api.artic.edu/api/v1/artworks?page=${random_page}&limit=30`
const url_products = `https://api.artic.edu/api/v1/products?page=${random_page}&&limit=30`


// CHECKING IF IMAGE EXISTS
function imageExists(image_url){

    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status != 404;
}

// Function that gets image_path for artworks API
function get_image(id){
    let image_path = `https://www.artic.edu/iiif/2/${id}/full/400,/0/default.jpg`;
    let image_ex = imageExists(image_path);
    if (image_ex){
        console.log(image_path)
        return image_path;
    }
    return false;
}


// FUNCTION THAT RETURNS API
async function get_API(url) {
    try{
        let response = await fetch(url);
        return await response.json();
    } catch (error){
        console.log(error)
    }
    
}

// FUNCTION that renders artworks
async function renderArtworks(){
    // Our loader while it's fetching
    let loader = `<div class="boxLoading">
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>                
                 </div>`;
    document.querySelector('.main').innerHTML = loader;

    let artworks = await get_API(url_artworks);
    
    // Printing data to make sure that all works
    console.log(artworks.data)
    
    let div = "<div class='artworks'>";
    
    // Looping through artworks
    for(let i=0; i<artworks.data.length;i++){
        let artwork = artworks.data[i]
        let image_path = get_image(artwork.image_id)
        if (image_path){

            let block = `
                            <div class="artwork">
                                <img class="art_image" src=${image_path} alt="artwork">
                                <div class="title-box"><p>${artwork?.title}</p></div>  
                            </div>
                        
                          
            `
            div+=block
        }
    }
    div+='</div>';

    let container = document.querySelector('.main');
    container.innerHTML = div;

}
// FUNCTION that sets active icon for artworks tab on navbar
function onClickArtworks(){
    let nav = document.getElementById('nav');
    nav.innerHTML="<button id='art' class='nav-elem' onclick='onClickArtworks()'><img src='images/artworkActive.svg' alt='img' width='57px' ></button> <button id='pro' class='nav-elem' onclick='onClickProducts()'><img src='images/productsPassive.svg' alt='' width='57px' ></button>";
    renderArtworks();
}



// FUNCTION THAT RENDERS PRODUCTS//
async function renderProducts(){
    let loader = `<div class="boxLoading">
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>                
 </div>`;
    document.querySelector('.main').innerHTML = loader;

    let products = await get_API(url_products);
    let div = '<div class="artworks">';

    // Looping through products API
    for(let i=0; i<products.data.length;i++){
        let product = products.data[i]

        let image_path = imageExists(product.image_url) && product.image_url;
        if (image_path){

            let block = `
                            <div class="artwork">
                                <img class="art_image" src=${image_path} alt="artwork">
                                <div class="product_title_box"><p>${product?.title}</p>
                                    <p class='product_price'> $${product?.min_current_price}</p>
                                    <div class="divider"></div>
                                    <div class='product_description'>${product?.description}</div>
                                
                                </div>  
                            </div>      
            `
            div+=block
        }
    }
    div+='</div>';

    let container = document.querySelector('.main');
    container.innerHTML = div;
}

// FUNCTION that sets active icon for products tab on navbar
function onClickProducts(){
    let nav = document.getElementById('nav');
    nav.innerHTML="<button id='art' class='nav-elem' onclick='onClickArtworks()'><img src='images/artworkPassive.svg' alt='img' width='57px'></button> <button id='pro' class='nav-elem' onclick='onClickProducts()'><img src='images/productsActive.svg' alt='' width='57px'></button>";
    renderProducts();
}

// By default main page is artworks
renderArtworks();
