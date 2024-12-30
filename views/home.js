const main_url = 'https://apidev.cultureholidays.com/api'; 
let base_URL = '';
base_URL = 'http://localhost:3000';

const addNewQstnBtn = document.getElementById('add-qstn-top-btn');
const editQstnBtn = document.getElementById('edit-qstn-top-btn');
const addQstnFormContainer = document.getElementById('add-ctgry-form-container');
const editQstnFormContainer = document.getElementById('edit-qstn-form-container');
const addNewCtgryMoreDetailDiv= document.getElementById('add-ctgry-more-detail');
const addNewSubCtgryDiv = document.getElementById('add-new-ctgry-subctgry');
const addNewCtgryQstns = document.getElementById("add-new-ctgry-question");
const addNewcategoryMoreDetailForm = document.getElementById("add-new-ctgry-more-details-form");
const addNewQstnTitleInputs = document.getElementById("add-new-ctgry-qstn-title-inputs-container");
const addNewSubCtgryTitleInputs = document.getElementById("add-new-subctgry-title-inputs-conatiner");

const ctgryEditOptions = document.getElementById("ctgry-edit-options");
const allRootCategoryUL = document.getElementById("all-root-categories");
const disableButtonContainer = document.getElementById('disable-btn-container');
const disableEnableButton = document.getElementById("ctgry-disable-enable-btn");
const editCtgryTitle = document.getElementById('edit-ctgry-title-p');
const editCtgryAddNewQstnBtn = document.getElementById("edit-panel-ctgry-add-newqstn-btn");
const editCtgryAddNewSubCtgryBtn = document.getElementById("edit-panel-ctgry-add-subctgry-btn");
const editPanelAddSubCtgryFormContainer = document.getElementById("edit-panel-add-subctgry-form-container");
const editPanelAddNewQstnFormContainer = document.getElementById("edit-panel-add-qstns-form-container");

const addNewCtrgyInput = document.getElementById('add-new-ctgry-input');
const addNewCtgryFormButton = document.getElementById('add-ctgry-form-btn');
const addNewQstnForm = document.getElementById('add-new-subctgry');

document.addEventListener('DOMContentLoaded',async ()=>{
    if(!localStorage.getItem('token')){
        location.href = 'login.html'
    }
    const { data} = await getRequest(`${main_url}/Holidays/Countrylist`);
    if(Array.isArray(data) && data.length > 0) updateAllCountriesList(data);
    appendAllRootCategories();
});

async function getRequest(url){
  return await axios({
    method : "GET",
    url,
    headers : {
        Authorization : localStorage.getItem('token')
    }
});}

async function postRequest(url, data){
  return await axios({
    method : "POST",
    url,
    headers : {
      Authorization : localStorage.getItem('token')
    },
    data
  });}

function updateAllCountriesList(countriesArray){
  const countryList = document.querySelector("#country-list-adding-new-root");
  countriesArray.forEach(country => {
    const option = document.createElement('option');
    option.value = country.countryCode;
    option.textContent = country.countryName;
    countryList.appendChild(option);
  })
}

async function selectedCountryInNewRoot(event){
  const {data} = await getRequest(`${main_url}/Holidays/PackagelistByCountrycode?Countrycode=${event.target.value}`);
  if(Array.isArray(data) && data.length > 0) updatePackagesList(data);
}

  async function updatePackagesList(packagesArray){
    const packageList = document.querySelector("#package-list-for-country");
    packagesArray.forEach(package => {
      const option = document.createElement('option');
      option.value = package.pkgID;
      option.textContent = package.pkgTitle;
      packageList.appendChild(option);
    });
    packageList.classList.remove("hide");
  }

async function appendAllRootCategories(){
    const { data } = await axios({
        method : "GET",
        url : `${base_URL}/faq/getallroots`,
        headers : {
            Authorization : localStorage.getItem('token')
        }
    });
    if(Array.isArray(data) && data.length > 0){
        data.forEach((ctgry)=>{
            const liElement = document.createElement('li');
            liElement.addEventListener('click',rooCategorySelected);
            liElement.setAttribute('data-rootid', ctgry.faq_root_id);
            liElement.setAttribute('data-haschild', ctgry.has_child);
            liElement.setAttribute('data-isactive',ctgry.status);
            liElement.innerHTML = `<span class="ctgry-statustype-dot" style="color:${ctgry.status ? 'green' : 'red'};">•</span>`+ ctgry.faq_title ;
            const button = document.createElement('button');
            button.textContent = ctgry.status ? 'Disable' : 'Enable';
            button.classList.add('disable-btn', ctgry.status ? 'active' : 'inactive');
            // liElement.appendChild(button);
            allRootCategoryUL.appendChild(liElement);
        });

    }
}

function handleNewEditBtn(event, type){
    switch (type){
        case 'add':
            editQstnBtn.classList.remove('op-selected');
            addNewQstnBtn.classList.add('op-selected');
            editQstnFormContainer.classList.add('hide');
            addQstnFormContainer.classList.remove('hide');
            break;
        case 'edit':
            addNewQstnBtn.classList.remove('op-selected');
            editQstnBtn.classList.add('op-selected');
            addQstnFormContainer.classList.add('hide');
            editQstnFormContainer.classList.remove('hide');
            break; 
    }
}

async function postNewRootCategory(event){
    event.preventDefault();
    const ctgryTitle = event.target.ctgrytitle.value;
    if(ctgryTitle == '')return;
    const loginRequired = event.target.loginrequire.value;
    const description = event.target.description.value;
    const page = event.target.page.value;
    const pkgid = event.target.packageid.value;
    const ctgryData = {
        description, 
        title : ctgryTitle, 
        login : loginRequired == 'true', 
        page, 
        isroot : true, 
        child : true, 
        pkgid
    }
    addNewCtgryFormButton.classList.add('loading');
    addNewCtgryFormButton.style.opacity = 0.5;
    addNewCtgryFormButton.disabled = true;
    addNewCtgryFormButton.textContent = 'Adding...'
    const { data } = await axios({
        method : "POST",
        url : `${base_URL}/faq/setroot`,
        headers : {
            Authorization : localStorage.getItem('token')
        },
        data : ctgryData
    });
    if(data){
        addQstnFormContainer.querySelector("#create-new-ctgry-form-container").classList.add('hide');
        addNewCtgryMoreDetailDiv.classList.remove('hide');
        addCategoryMoreDetail(data);
    }else{
    }
    addNewCtgryFormButton.classList.remove('loading');
    addNewCtgryFormButton.style.opacity = 1
    addNewCtgryFormButton.textContent = 'Add'
    addNewCtgryFormButton.disabled = false;
}

function addCategoryMoreDetail(data){
    if(data.has_child == true){
        addNewCtgryQstns.classList.add("hide");
        addNewSubCtgryDiv.classList.remove("hide");
        makeNewSubCtgryForm(data);
    }
    else{
        addNewSubCtgryDiv.classList.add("hide");
        addNewCtgryQstns.classList.remove("hide");
        addNewCtgryQstns.querySelector('form').querySelector('#new-ctgryqstn-rootid-hidden').value = data.faq_root_id;
        addNewCtgryQstns.querySelector('form').querySelector('#new-ctgryqstn-faqtitle-hidden').value = data.faq_title;
        makeNewctgryQstns(data);
    }
}

async function makeNewSubCtgryForm(rootData){
  const {data} = await getRequest(`${base_URL}/faq/getactiveroot`);
  const parentInputBox = document.querySelector("#add-new-ctgry-id");
  parentInputBox.setAttribute("data-ctgryid",rootData.faq_root_id);
  parentInputBox.value = rootData.faq_title;
  if(Array.isArray(data) && data.length > 0){
    const nestedSelectDiv = document.querySelector("#nested-new-subctgry-selectdiv");
    const select = document.createElement("select");
    select.onchange = makeSubCategoriesSelect;
    data.forEach(root=>{
      const option = document.createElement('option');
      root.faq_root_id == rootData.faq_root_id ? option.selected = true : "";
      option.value = root.faq_root_id;
      option.textContent = root.faq_title;
      select.appendChild(option);
    });
    nestedSelectDiv.appendChild(select);
  }
}

async function makeSubCategoriesSelect(event){
  const parentInputBox = document.querySelector("#add-new-ctgry-id");
  parentInputBox.setAttribute("data-ctgryid",event.target.value);
  parentInputBox.value = event.target[event.target.selectedIndex].textContent;
  const nestedSelectDiv = document.querySelector("#nested-new-subctgry-selectdiv");
  const selectElementsArray = Array.from(nestedSelectDiv.querySelectorAll("select"));
  const indexOf = selectElementsArray.indexOf(event.target);
  for(let i = indexOf+1 ;i <selectElementsArray.length; i++){
    nestedSelectDiv.removeChild(selectElementsArray[i]);
  }
  const {data} = await getRequest(`${base_URL}/faq/subcategories?parentid=${event.target.value}`);
  if(Array.isArray(data) && data.length > 0){
    const select = document.createElement("select");
    select.onchange = makeSubCategoriesSelect;
    data.forEach((ctgry)=>{
      const option = document.createElement('option');
      option.value = ctgry.faq_root_id;
      option.textContent = ctgry.faq_title;
      select.appendChild(option);
    });
    nestedSelectDiv.appendChild(select);
  }
}

function makeNewctgryQstns(rootData){

}

function postNewRootSubCategory(event){
  
}

function handleButtonClick(button) {
    // Add the loading class to the button
    button.classList.add('loading');
    // Disable the button to prevent multiple clicks
    button.disabled = true;
  
    // Simulate an async operation (e.g., form submission)
    setTimeout(() => {
      // Remove the loading class
      button.classList.remove('loading');
      // Re-enable the button
      button.disabled = false;
    }, 2000); // Adjust time or replace with your async logic
}

  const dropdownButton = document.getElementById('dropdownButton');
  const dropdownContent = document.getElementById('dropdownContent');
  const searchInput = document.getElementById('searchInput');
  const allRootCategoriesUL = document.getElementById('all-root-categories');
  const rootCategoriesOptions = allRootCategoriesUL.getElementsByTagName('li');

  // Toggle dropdown visibility
  dropdownButton.addEventListener('click', () => {
    dropdownContent.classList.toggle('show');
  });

  // Search functionality
  searchInput.addEventListener('keyup', () => {
    const filter = searchInput.value.toLowerCase();
    for (let i = 0; i < rootCategoriesOptions.length; i++) {
      const optionText = rootCategoriesOptions[i].textContent || rootCategoriesOptions[i].innerText;
      if (optionText.toLowerCase().includes(filter)) {
        rootCategoriesOptions[i].style.display = "";
      } else {
        rootCategoriesOptions[i].style.display = "none";
      }
    }
  });

  // Select an option and close dropdown
  for (let i = 0; i < rootCategoriesOptions.length; i++) {
    rootCategoriesOptions[i].addEventListener('click', function() {
      dropdownButton.textContent = this.textContent; // Set selected option as button text
      dropdownContent.classList.remove('show'); // Hide dropdown
      searchInput.value = ""; // Clear search input
      Array.from(rootCategoriesOptions).forEach(option => option.style.display = ""); // Reset option visibility
    });
  }

  // Close dropdown if clicked outside
  window.addEventListener('click', (e) => {
    if (!e.target.matches('#dropdownButton') && !e.target.matches('#searchInput')) {
      dropdownContent.classList.remove('show');
    }
  });

  function rooCategorySelected(event){
    const hasChild = event.target.getAttribute('data-haschild');
    const rootId = event.target.getAttribute('data-rootid');
    const isActive = event.target.getAttribute('data-isactive');
    editCtgryTitle.value = event.target.textContent.slice(1);
    disableEnableButton.textContent = isActive == 'true'? 'Disable Category' : 'Enable Category';
    disableEnableButton.style.backgroundColor = isActive == 'true' ? '#ec2b2b': '#20e020';
    disableEnableButton.setAttribute('data-rootid', rootId);
    disableEnableButton.setAttribute('data-action', isActive == 'true' ? 'disable' : 'enable');
    disableButtonContainer.classList.remove('hide');
    editCtgryAddNewQstnBtn.setAttribute("data-rootid",rootId);
    editCtgryAddNewSubCtgryBtn.setAttribute("data-rootid",rootId);
  }

  async function fetchAndMakeRootSubctgry(rootid){
    const {data} = await getRequest(`${base_URL}/faq/subcategories?parentid=${rootid}`);
    if(Array.isArray(data) && data.length > 0){
      
    }
  }

  function setAttributesForEditButtons(){

  }

  async function disableEnableRootCategory(event){
    const rootid = event.target.getAttribute('data-rootid');
    const action = event.target.getAttribute("data-action");
    event.target.classList.add('loading');
    event.target.style.opacity = 0.5;
    event.target.disabled = true;
    const {data} = await axios({
        method : "POST",
        url : `${base_URL}/faq/changectgrystatus`,
        headers : {
            Authorization : localStorage.getItem('token')
        },
        data : {
            rootid,
            action 
        }
    });
    event.target.classList.remove('loading');
    event.target.style.opacity = 1;
    event.target.disabled = false;
    if(data){
        console.log(data.status);
        disableEnableButton.style.backgroundColor = data.status ? '#ec2b2b' : '#20e020';
        disableEnableButton.textContent = data.status ? 'Disable Category' : 'Enable Category';
        event.target.setAttribute("data-action", data.status ? 'disable' : 'enable');
    }
  }

  function addRemoveMoreSubTitle(event){
    const button = event.target;
    const buttonContent = button.textContent;
    const buttonsParent = button.parentElement;
    const subTitleContainer = buttonsParent.parentElement;
    if(buttonContent == '+'){
        const nextElement = document.createElement('input');
        nextElement.setAttribute("required", true);
        nextElement.setAttribute("type", "text");
        nextElement.setAttribute("placeholder","Add Sub Category Title");
        subTitleContainer.appendChild(nextElement);
    }else{
        const nextElement = buttonsParent.nextElementSibling;
        subTitleContainer.removeChild(nextElement);
    }
  }

  function addRemoveMoreCtrgyQstnsTitle(event, action){
    console.log(addNewQstnTitleInputs.childNodes.length);
    if(action == 'add'){
        const titleInputElement = document.createElement('input');
        titleInputElement.setAttribute("type","text");
        titleInputElement.setAttribute("required",true);
        titleInputElement.setAttribute("placeholder","Enter Question Title");
        addNewQstnTitleInputs.appendChild(titleInputElement);
    }else{
        if(addNewQstnTitleInputs.childElementCount > 1){
            addNewQstnTitleInputs.removeChild(addNewQstnTitleInputs.lastElementChild)
        }
    }
  }

  function addRemoveMoreSubCtgryTitle(event, action){
    const parentFormElement = event.target.closest("form");
    console.log(parentFormElement);
    if(action == 'add'){
      const ctgryInputContainer = document.createElement('div');

        ctgryInputContainer.appendChild(titleInputElement);
    }else{
        if(addNewSubCtgryTitleInputs.childElementCount > 1){
            addNewSubCtgryTitleInputs.removeChild(addNewSubCtgryTitleInputs.lastElementChild)
        }
    }
  }

  function createSubCtgryForRoot(event){
    event.preventDefault();
    const inputElements = addNewSubCtgryTitleInputs.querySelectorAll('input');
    for(let index = 0; index < inputElements.length; index++){
      console.log(inputElements[index].value);
    };
  }

  async function editPanelAddSubCtgryBtnHandler(event){
    const rootid = event.target.getAttribute("data-rootid");
    const {data} = await postRequest(`${base_URL}/faq/getctgry?ROOTID=${rootid}`);
    console.log(data);
    editPanelAddNewQstnFormContainer.classList.add("hide");
    editPanelAddSubCtgryFormContainer.classList.remove('hide');
  }

  async function editPanelAddNewQstnHandler(event){
    const rootid = event.target.getAttribute("data-rootid");
    editPanelAddNewQstnFormContainer.classList.add("hide");
    editPanelAddSubCtgryFormContainer.classList.remove('hide');
    console.log(rootid)
  }
  