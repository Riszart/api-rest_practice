const itemDog = document.querySelector('.epi-dog')
itemDog.addEventListener('click', ()=>{hideFavorite();selectItem('dog');closeAdd()})
const itemCat = document.querySelector('.epi-cat')
itemCat.addEventListener('click', ()=>{hideFavorite();selectItem('cat');closeAdd()})
const loadFavoriteElements = document.querySelector('.favorite-items')
loadFavoriteElements.addEventListener('click', ()=>{loadFavoriteAllItems()})

document.querySelector('.load-image-charge').addEventListener('change', preview)
document.querySelector('.close').onclick = ()=>closeAdd()
document.querySelector('.add-element').onclick = ()=>{
  document.querySelector('.add-image').style.display = 'block'
  hideFavorite()
}

const API_CAT = 'https://api.thecatapi.com/v1/'
const API_DOG = 'https://api.thedogapi.com/v1/'
const API_DOG_FAVORITE = 'live_MGjDauDaqUQETmRo3kt9YkUtRJQToU9uz9lX8GpILQmi29OBJrsIKch9y8WGmTA0'
const API_CAT_FAVORITE = 'live_P1PQVgi5O0mOXMOzfKWjjAorhX5JzkRwpuwfZV4ysPEEo5HgpZ19sqpEKBuRlpWn'

const API = {
  url:'',
  apikey:'',
}
const favoriteItems = []

function loadFavoriteAllItems(){
  document.querySelector('.only-favorite__animal').style.display = 'block'
  document.querySelector('.content-all__favorite').innerText = ''
  API.url = API_CAT
  API.apikey = API_CAT_FAVORITE
  loadFavoriteAnimal()
  API.url = API_DOG
  API.apikey = API_DOG_FAVORITE
  loadFavoriteAnimal()
}
function hideFavorite(){
  document.querySelector('.only-favorite__animal').style.display = 'none'
}
function closeAdd(){
  document.querySelector('.add-image').style.display = 'none'
  document.querySelector('.image-load').src = ''
  document.querySelector('#cat-select').checked = false
  document.querySelector('#dog-select').checked = false
  document.querySelector('.load-image-charge').value = ''
}
function createItem(stringSection, url, id, item){
  const section = document.querySelector(`.${stringSection}-content`)
  const article = document.createElement('div')
  article.classList.add(`${stringSection}-item`)

  const img = document.createElement('img')
  img.src = url
  img.classList.add(`${stringSection}__image`)

  const div = document.createElement('div')
  div.classList.add(`${stringSection}-data`)

  const divleft = document.createElement('div')

  const p = document.createElement('p')
  p.classList.add(`${stringSection}__name-image`)
  const pText = document.createTextNode(`${id}`)

  const divright = document.createElement('button')
  let text 
  if(stringSection == 'random'){
    text = 'add'
    divright.classList.add('random-add')
    divright.onclick = ()=>addItemToFavorite(id)
  }
  if(stringSection == 'favorite' || stringSection == 'favorite-all'){
    text = 'remove'
    divright.classList.add('favorite-remove')
    divright.onclick = ()=>deleteItemToFavorite(item.id)
  }
  const buttonText = document.createTextNode(text)

  divright.appendChild(buttonText)

  p.appendChild(pText)
  divleft.appendChild(p)
  div.append(divleft, divright)
  article.append(img, div)
  section.append(article)
}
async function loadItems(){
  await fetch(`${API.url}images/search?limit=10`,{
    method:'GET',
    headers:{
      'x-api-key':API.apikey
    }
  })
    .then(response=>response.json())
    .then(data=> {
      document.querySelector('.random-content').style.gridTemplateColumns = `repeat(${data.length}, 250px)`
      data.forEach(item =>createItem('random', item.url, item.id));
    })
    .catch(error=> console.log(error))
}
async function loadFavorite(){
  await fetch(`${API.url}favourites`, {
    method: 'GET',
    headers: {'x-api-key':API.apikey}
  })
    .then(response=>response.json())
    .then(data=> {
      document.querySelector('.favorite-content').innerText = ''
      document.querySelector('.favorite-content').style.gridTemplateColumns = `repeat(${data.length}, 250px)`
      data.forEach(item =>{
        createItem('favorite', item.image.url, item.image_id, item)
        if(!favoriteItems.some((element)=>element.image_id === item.image_id)){
          favoriteItems.push(item)
        }
      })
    })
    .catch(error=> console.log(error))
}
async function deleteItemToFavorite(id){
  await fetch(`${API.url}favourites/${id}`, {
    method: 'DELETE',
    headers:{
      'x-api-key':API.apikey,
    },
  })
    .then(response=>{
      response.json()
      loadFavorite()
      loadFavoriteAllItems()
    })
    .catch(error=> console.log(error))
}
async function addItemToFavorite(id){
  if(!favoriteItems.some((item)=>item.image_id === id)){
    await fetch(`${API.url}favourites`, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'x-api-key':API.apikey
      },
      body: JSON.stringify({
        image_id: id
      })
    })
      .then(response=>{
        response.json()
        loadFavorite()
      })
      .catch(error=> console.log(error))
  }else{
    document.querySelector('.text-verify').innerText = "item ya fue agregado a favoritos"
    document.querySelector('.verify-show').style.display = 'block'
    setTimeout(()=>document.querySelector('.verify-show').style.display = 'none',1000)
  }
}
async function selectItem(item){
  showLoad()
  document.querySelector('.content-card__elements').style.display = 'block'
  document.querySelector('.random-content').innerText = ''
  document.querySelector('.favorite-content').innerText = ''
  if(item === 'cat'){
    itemCat.style.color = 'red'
    itemDog.style.color = 'white'
    API.url = API_CAT
    API.apikey = API_CAT_FAVORITE
  }
  if(item === 'dog'){
    itemDog.style.color = 'red'
    itemCat.style.color = 'white'
    API.url = API_DOG
    API.apikey = API_DOG_FAVORITE
  }
  await loadItems()
  await loadFavorite()
  await hideLoad()
}
async function loadFavoriteAnimal(){
  await fetch(`${API.url}favourites`, {
    method: 'GET',
    headers: {'x-api-key':API.apikey}
  })
    .then(response=>response.json())
    .then(data=>{
      data.forEach(item=>{
        createItem('favorite-all', item.image.url, item.image_id, item)
      })
    })
}
function preview(event){
  if(!event.target.files.length)return
  let objectURL = URL.createObjectURL(event.target.files[0])
  document.querySelector('.image-load').src = objectURL
}
async function addImageServer(){
  document.querySelector('.add-image').style.display = 'none'
  const form = document.querySelector('#content-form')
  const formData = new FormData(form)

  const animalCat = document.querySelector('#cat-select')
  const animalDog = document.querySelector('#dog-select')
  if(animalCat.checked){
    API.url = API_CAT
    API.apikey = API_CAT_FAVORITE
  }
  if(animalDog.checked){
    API.url = API_DOG
    API.apikey = API_DOG_FAVORITE
  }
  if(animalDog.checked || animalCat.checked){
    const res = await fetch(`${API.url}images/upload`, {
      method: 'POST',
      headers: {
        'x-api-key':API.apikey
      },
      body: formData
    })
    const data = await res.json();
    if (res.status !== 201) {
      console.log(res.status)
    }
    else {
        console.log("Foto de michi cargada :)");
        addItemToFavorite(data.id)
    }
  }
}
async function showLoad(){
  document.querySelector('.wait-load').style.display = 'block'
}
async function hideLoad(){
  document.querySelector('.wait-load').style.display = 'none'
}