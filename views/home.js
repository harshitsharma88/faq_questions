const main_url = "https://apidev.cultureholidays.com/api";
let base_URL = "";
base_URL = "https://horribly-smashing-humpback.ngrok-free.app";
base_URL = "http://localhost:3000";

const addNewQstnBtn = document.getElementById("add-qstn-top-btn");
const editQstnBtn = document.getElementById("edit-qstn-top-btn");
const addQstnFormContainer = document.getElementById(
  "add-ctgry-form-container"
);
const editQstnFormContainer = document.getElementById(
  "edit-qstn-form-container"
);
const addnewQstnFormContainer = document.getElementById(
  "add-new-qstn-form-container"
);
const addNewCtgryMoreDetailDiv = document.getElementById(
  "add-ctgry-more-detail"
);
const addNewSubCtgryDiv = document.getElementById("add-new-ctgry-subctgry");
const addNewCtgryQstns = document.getElementById("add-new-ctgry-question");
const addNewcategoryMoreDetailForm = document.getElementById(
  "add-new-ctgry-more-details-form"
);
const addNewQstnTitleInputs = document.getElementById(
  "add-new-ctgry-qstn-title-inputs-container"
);
const addNewSubCtgryTitleInputs = document.getElementById(
  "add-new-subctgry-title-inputs-conatiner"
);

const ctgryEditOptions = document.getElementById("ctgry-edit-options");
const allRootCategoryUL = document.getElementById("all-root-categories");
const disableButtonContainer = document.getElementById("disable-btn-container");
const disableEnableButton = document.getElementById("ctgry-disable-enable-btn");
const editCtgryTitle = document.getElementById("edit-ctgry-title-p");
const editCtgryAddNewQstnBtn = document.getElementById(
  "edit-panel-ctgry-add-newqstn-btn"
);
const editCtgryAddNewSubCtgryBtn = document.getElementById(
  "edit-panel-ctgry-add-subctgry-btn"
);
const editPanelAddSubCtgryFormContainer = document.getElementById(
  "edit-panel-add-subctgry-form-container"
);
const editPanelAddNewQstnFormContainer = document.getElementById(
  "edit-panel-add-qstns-form-container"
);

const addNewCtrgyInput = document.getElementById("add-new-ctgry-input");
const addNewCtgryFormButton = document.getElementById("add-ctgry-form-btn");
const addNewQstnForm = document.getElementById("add-new-subctgry");


let countryListSelect = "";
document.addEventListener("DOMContentLoaded", async () => {
  if (!localStorage.getItem("token")) {
    location.href = "login.html";
  }
  const { data } = await getRequest(`${main_url}/Holidays/Countrylist`);
  if (Array.isArray(data) && data.length > 0) {
    localStorage.setItem("country-list", JSON.stringify(data));
    data.forEach(country =>{
      countryListSelect += `<option value=${country.countryCode}>${country.countryName}</option>`
    })
    updateAllCountriesList(data);
  }
  appendAllRootCategories();
});

async function getRequest(url) {
  try {
    return await axios({
      method: "GET",
      url,
      headers: {
        "ngrok-skip-browser-warning": "69420",
        Authorization: localStorage.getItem("token"),
      },
    });
    
  } catch (error) {
    if(error.response &&error.response.status == 401) {
      localStorage.clear();
      location.replace("/login.html");
    }
    throw new Error(error);
  }
}

async function postRequest(url, data) {
  try {
    return await axios({
      method: "POST",
      url,
      headers: {
        "ngrok-skip-browser-warning": "69420",
        Authorization: localStorage.getItem("token"),
      },
      data,
    });
  } catch (error) {
    if(error.response &&error.response.status == 401){
      localStorage.clear();
       location.replace("/login.html");
      }
    throw new Error(error);
  }
}

function makeAddSubCategoryForm(parentId, countryListOptions){
  const formElement = document.createElement("form");
  formElement.onsubmit = (event)=>{
    postNewRootSubCategory(event, parentId)
  };
  formElement.innerHTML = `<div class="form-manadatory-elements">
                                <p>Enter Title for Sub-Category<i style="color: red;font-size: small;">*</i></p>
                                <input type="text" data placeholder="Enter Category Title" name="ctgrytitle" required>
                                <label for="countries">
                                    Choose Package (Optional)
                                </label>
                                <select name="countries" id="countrylist-subctgry" class="countrylist "
                                    onchange="selectedCountryInSubCtgry(event)">
                                    <option value="" selected disabled>Choose Country..</option>
                                    ${countryListOptions}
                                </select>
                                <div class="login-required-radio">
                                    <p
                                        style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                                        Is Login Required<i style="font-size: smaller; color: red;">*</i></p>
                                    <label for="">
                                        <input type="radio" class="" name="loginrequire" value="true" required>
                                        Yes
                                    </label>
                                    <label for="">
                                        <input type="radio" class="" name="loginrequire" value="false" required>
                                        No
                                    </label>
                                </div>
                                <!-- <div class="has-child-radio">
                                    <p
                                        style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                                        Can Have Sub Category<i style="font-size: smaller; color: red;">*</i></p>
                                    <label for="">
                                        <input type="radio" class="" name="haschild" value="true" required>
                                        Yes
                                    </label>
                                    <label for="">
                                        <input type="radio" class="" name="haschild" value="false" required>
                                        No
                                    </label>
                                </div> -->
                            </div>
                            <div class="form-optional-elements">
                                <label for="description">
                                    Add description (If Any)
                                </label>
                                <input type="text" placeholder="Type here" id="" name="description">
                                <label for="page">
                                    Attach on Page (Optional)
                                </label>
                                <input type="text" placeholder="Type here" id="" name="page">
                                </select>
                            </div>
                            <button class="btn-loader" type="submit" id="add-ctgry-form-btn">Add Sub-Category</button>`
}

function makeAddQuestionForm(ctgryId, countryListOptions){
  const formElement = document.createElement("form");
  formElement.onsubmit = (event)=>{
    postNewQuestion(event, ctgryId)
  };
  formElement.innerHTML = `<div class="form-manadatory-elements">
                                <p>Enter Question Title<i style="color: red;font-size: small;">*</i></p>
                                <input type="text" data placeholder="Question Title" name="qstntitle" required>
                                <label for="countries">
                                    Choose Package (Optional)
                                </label>
                                <select name="countries" id="countrylist-subctgry" class="countrylist "
                                    onchange="selectedCountryInSubCtgry(event)">
                                    <option value="" selected disabled>Choose Country..</option>
                                    ${countryListOptions || countryListSelect}
                                </select>
                                <div class="login-required-radio">
                                    <p
                                        style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                                        Is Login Required<i style="font-size: smaller; color: red;">*</i></p>
                                    <label for="">
                                        <input type="radio" class="" name="loginrequire" value="true" required>
                                        Yes
                                    </label>
                                    <label for="">
                                        <input type="radio" class="" name="loginrequire" value="false" required>
                                        No
                                    </label>
                                </div>
                            </div>
                            <div class="form-optional-elements">
                                <label for="description">
                                    Add description (If Any)
                                </label>
                                <input type="text" placeholder="Type here" id="" name="description">
                                <label for="page">
                                    Attach on Page (Optional)
                                </label>
                                <input type="text" placeholder="Type here" id="" name="page">
                                </select>
                            </div>
                            <button class="btn-loader" type="submit" id="add-ctgry-form-btn">Add Questiony</button>`
          return formElement;
}

function updateAllCountriesList(countriesArray) {
  const countryList = document.querySelector("#country-list-adding-new-root");
  countriesArray.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.countryCode;
    option.textContent = country.countryName;
    countryList.appendChild(option);
  });
}

async function selectedCountryInNewRoot(event) {
  const { data } = await getRequest(
    `${main_url}/Holidays/PackagelistByCountrycode?Countrycode=${event.target.value}`
  );
  if (Array.isArray(data) && data.length > 0) updatePackagesList(data);
}

async function updatePackagesList(packagesArray) {
  const packageList = document.querySelector("#package-list-for-country");
  packagesArray.forEach((package) => {
    const option = document.createElement("option");
    option.value = package.pkgID;
    option.textContent = package.pkgTitle;
    packageList.appendChild(option);
  });
  packageList.classList.remove("hide");
}

async function appendAllRootCategories() {
  console.log("Appeding All Root Categories");
  const {data} = await getRequest(`${base_URL}/faq/getallroots`);
  console.log(data);
  if (Array.isArray(data) && data.length > 0) {
    console.log(data.length);
    data.forEach((ctgry) => {
      const liElement = document.createElement("li");
      liElement.addEventListener("click", rooCategorySelected);
      liElement.setAttribute("data-rootid", ctgry.faq_root_id);
      liElement.setAttribute("data-haschild", ctgry.has_child);
      liElement.setAttribute("data-isactive", ctgry.status);
      liElement.innerHTML =
        `<span class="ctgry-statustype-dot" style="color:${
          ctgry.status ? "green" : "red"
        };">•</span>` + ctgry.faq_title;
      const button = document.createElement("button");
      button.textContent = ctgry.status ? "Disable" : "Enable";
      button.classList.add("disable-btn", ctgry.status ? "active" : "inactive");
      // liElement.appendChild(button);
      allRootCategoryUL.appendChild(liElement);
    });
  }
}

function handleNewEditBtn(event){
  if(event.target.classList.contains("top-btn")){
    const type = event.target.getAttribute("data-action");
    document.querySelector("#form-group-container").querySelectorAll(".form-container").forEach((formContainer)=>{
      formContainer.classList.add("hide");
    });
    switch (type) {
      case 'add':
        addQstnFormContainer.classList.remove("hide");
        break;
      case 'edit':
        editQstnFormContainer.classList.remove("hide");
        break;
      case 'qstn':
        addnewQstnFormContainer.querySelector("select[name='countries']").innerHTML = countryListSelect;
        addnewQstnFormContainer.querySelector("select")
        addnewQstnFormContainer.classList.remove("hide");
        break;
    }
  }
}

// function handleNewEditBtn(event, type) {
//   switch (type) {
//     case "add":
//       editQstnBtn.classList.remove("op-selected");
//       addNewQstnBtn.classList.add("op-selected");
//       editQstnFormContainer.classList.add("hide");
//       addQstnFormContainer.classList.remove("hide");
//       break;
//     case "edit":
//       addNewQstnBtn.classList.remove("op-selected");
//       editQstnBtn.classList.add("op-selected");
//       addQstnFormContainer.classList.add("hide");
//       editQstnFormContainer.classList.remove("hide");
//       break;
//     case "qstn":
//   }
// }

async function postNewRootCategory(event) {
  event.preventDefault();
  const ctgryTitle = event.target.ctgrytitle.value;
  if (ctgryTitle == "") return;
  const loginRequired = event.target.loginrequire.value;
  const description = event.target.description.value;
  const page = event.target.page.value;
  const pkgid = event.target.packageid.value;
  const ctgryData = {
    description,
    title: ctgryTitle,
    login: loginRequired == "true",
    page,
    isroot: true,
    child: true,
    pkgid,
  };
  addNewCtgryFormButton.classList.add("loading");
  addNewCtgryFormButton.style.opacity = 0.5;
  addNewCtgryFormButton.disabled = true;
  addNewCtgryFormButton.textContent = "Adding...";
  const { data } = await axios({
    method: "POST",
    url: `${base_URL}/faq/setroot`,
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    data: ctgryData,
  });
  if (data) {
    addQstnFormContainer
      .querySelector("#create-new-ctgry-form-container")
      .classList.add("hide");
    addNewCtgryMoreDetailDiv.classList.remove("hide");
    addCategoryMoreDetail(data);
  } else {
  }
  addNewCtgryFormButton.classList.remove("loading");
  addNewCtgryFormButton.style.opacity = 1;
  addNewCtgryFormButton.textContent = "Add";
  addNewCtgryFormButton.disabled = false;
}

function addCategoryMoreDetail(data) {
  if (data.has_child == true) {
    addNewCtgryQstns.classList.add("hide");
    addNewSubCtgryDiv.classList.remove("hide");
    makeNewSubCtgryForm(data);
  } else {
    addNewSubCtgryDiv.classList.add("hide");
    addNewCtgryQstns.classList.remove("hide");
    addNewCtgryQstns
      .querySelector("form")
      .querySelector("#new-ctgryqstn-rootid-hidden").value = data.faq_root_id;
    addNewCtgryQstns
      .querySelector("form")
      .querySelector("#new-ctgryqstn-faqtitle-hidden").value = data.faq_title;
    makeNewctgryQstns(data);
  }
}

async function makeNewSubCtgryForm(rootData) {
  const { data } = await getRequest(`${base_URL}/faq/getactiveroot`);
  const subctgryCountrySelect = document.querySelector("#countrylist-subctgry");
  JSON.parse(localStorage.getItem("country-list")).forEach(country =>{
    const option = document.createElement("option");
    option.value = country.countryCode;
    option.textContent = country.countryName;
    subctgryCountrySelect.appendChild(option);
  })
  const parentInputBox = document.querySelector("#add-new-ctgry-id");
  parentInputBox.setAttribute("data-ctgryid", rootData.faq_root_id);
  parentInputBox.value = rootData.faq_title;
  if (Array.isArray(data) && data.length > 0) {
    const nestedSelectDiv = document.querySelector(
      "#nested-new-subctgry-selectdiv"
    );
    const select = document.createElement("select");
    select.onchange = makeSubCategoriesSelect;
    data.forEach((root) => {
      const option = document.createElement("option");
      root.faq_root_id == rootData.faq_root_id ? (option.selected = true) : "";
      option.value = root.faq_root_id;
      option.textContent = root.faq_title;
      select.appendChild(option);
    });
    nestedSelectDiv.appendChild(select);
  }
}

async function selectedCountryInSubCtgry(event){
  const { data } = await getRequest(
    `${main_url}/Holidays/PackagelistByCountrycode?Countrycode=${event.target.value}`
  );
  if (Array.isArray(data) && data.length > 0) updatePackagesListinSubCtgry(data,event.target);
}

function updatePackagesListinSubCtgry(packagesArray, countrySelect){
  const select = document.createElement("select");
  packagesArray.forEach((package) => {
    const option = document.createElement("option");
    option.value = package.pkgID;
    option.textContent = package.pkgTitle;
    select.appendChild(option);
  });
  select.setAttribute("name","pkgid");
  countrySelect.insertAdjacentElement("afterend",select);
}

async function makeSubCategoriesSelect(event) {
  const parentInputBox = document.querySelector("#add-new-ctgry-id");
  parentInputBox.setAttribute("data-ctgryid", event.target.value);
  parentInputBox.value = event.target[event.target.selectedIndex].textContent;
  const nestedSelectDiv = document.querySelector(
    "#nested-new-subctgry-selectdiv"
  );
  const selectElementsArray = Array.from(
    nestedSelectDiv.querySelectorAll("select")
  );
  const indexOf = selectElementsArray.indexOf(event.target);
  for (let i = indexOf + 1; i < selectElementsArray.length; i++) {
    nestedSelectDiv.removeChild(selectElementsArray[i]);
  }
  const { data } = await getRequest(
    `${base_URL}/faq/subcategories?parentid=${event.target.value}`
  );
  if (Array.isArray(data) && data.length > 0) {
    const select = document.createElement("select");
    select.onchange = makeSubCategoriesSelect;
    data.forEach((ctgry) => {
      const option = document.createElement("option");
      option.value = ctgry.faq_root_id;
      option.textContent = ctgry.faq_title;
      select.appendChild(option);
    });
    nestedSelectDiv.appendChild(select);
  }
}

async function makeNestedSubCategoriesSelect(event) {
  const ctgryTitleAndId = event.target.closest("form").querySelector("input[name='categorytitleid']");
  ctgryTitleAndId.setAttribute("data-ctgryid", event.target.value);
  ctgryTitleAndId.value = event.target[event.target.selectedIndex].textContent;
  const nestedSelectDiv = event.target.parentElement;
  const selectElementsArray = Array.from(
    nestedSelectDiv.querySelectorAll("select")
  );
  const indexOf = selectElementsArray.indexOf(event.target);
  for (let i = indexOf + 1; i < selectElementsArray.length; i++) {
    nestedSelectDiv.removeChild(selectElementsArray[i]);
  }
  const { data } = await getRequest(
    `${base_URL}/faq/subcategories?parentid=${event.target.value}`
  );
  if (Array.isArray(data) && data.length > 0) {
    const select = document.createElement("select");
    select.onchange = makeNestedSubCategoriesSelect;
    const optionDefault = document.createElement("option");
    optionDefault.selected = true;
    optionDefault.disabled = true;
    optionDefault.textContent = "Choose Category..";
    select.appendChild(optionDefault);
    data.forEach((ctgry) => {
      const option = document.createElement("option");
      option.value = ctgry.faq_root_id;
      option.textContent = ctgry.faq_title;
      select.appendChild(option);
    });
    nestedSelectDiv.appendChild(select);
  }
}

function handleButtonClick(button) {
  // Add the loading class to the button
  button.classList.add("loading");
  // Disable the button to prevent multiple clicks
  button.disabled = true;

  // Simulate an async operation (e.g., form submission)
  setTimeout(() => {
    // Remove the loading class
    button.classList.remove("loading");
    // Re-enable the button
    button.disabled = false;
  }, 2000); // Adjust time or replace with your async logic
}

const dropdownButton = document.getElementById("dropdownButton");
const dropdownContent = document.getElementById("dropdownContent");
const searchInput = document.getElementById("searchInput");
const allRootCategoriesUL = document.getElementById("all-root-categories");
const rootCategoriesOptions = allRootCategoriesUL.getElementsByTagName("li");

// Toggle dropdown visibility
dropdownButton.addEventListener("click", () => {
  dropdownContent.classList.toggle("show");
});

// Search functionality
searchInput.addEventListener("keyup", () => {
  const filter = searchInput.value.toLowerCase();
  for (let i = 0; i < rootCategoriesOptions.length; i++) {
    const optionText =
      rootCategoriesOptions[i].textContent ||
      rootCategoriesOptions[i].innerText;
    if (optionText.toLowerCase().includes(filter)) {
      rootCategoriesOptions[i].style.display = "";
    } else {
      rootCategoriesOptions[i].style.display = "none";
    }
  }
});

// Select an option and close dropdown
for (let i = 0; i < rootCategoriesOptions.length; i++) {
  rootCategoriesOptions[i].addEventListener("click", function () {
    dropdownButton.textContent = this.textContent; // Set selected option as button text
    dropdownContent.classList.remove("show"); // Hide dropdown
    searchInput.value = ""; // Clear search input
    Array.from(rootCategoriesOptions).forEach(
      (option) => (option.style.display = "")
    ); // Reset option visibility
  });
}

// Close dropdown if clicked outside
window.addEventListener("click", (e) => {
  if (
    !e.target.matches("#dropdownButton") &&
    !e.target.matches("#searchInput")
  ) {
    dropdownContent.classList.remove("show");
  }
});

function rooCategorySelected(event) {
  const hasChild = event.target.getAttribute("data-haschild");
  const rootId = event.target.getAttribute("data-rootid");
  const isActive = event.target.getAttribute("data-isactive");
  editCtgryTitle.value = event.target.textContent.slice(1);
  disableEnableButton.textContent =
    isActive == "true" ? "Disable Category" : "Enable Category";
  disableEnableButton.style.backgroundColor =
    isActive == "true" ? "#ec2b2b" : "#20e020";
  disableEnableButton.setAttribute("data-rootid", rootId);
  disableEnableButton.setAttribute(
    "data-action",
    isActive == "true" ? "disable" : "enable"
  );
  disableButtonContainer.classList.remove("hide");
  editCtgryAddNewQstnBtn.setAttribute("data-rootid", rootId);
  editCtgryAddNewSubCtgryBtn.setAttribute("data-rootid", rootId);
}

async function fetchAndMakeRootSubctgry(rootid) {
  const { data } = await getRequest(
    `${base_URL}/faq/subcategories?parentid=${rootid}`
  );
  if (Array.isArray(data) && data.length > 0) {
  }
}

function setAttributesForEditButtons() {}

async function disableEnableRootCategory(event) {
  const rootid = event.target.getAttribute("data-rootid");
  const action = event.target.getAttribute("data-action");
  event.target.classList.add("loading");
  event.target.style.opacity = 0.5;
  event.target.disabled = true;
  const { data } = await axios({
    method: "POST",
    url: `${base_URL}/faq/editcategory`,
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    data: {
      rootid,
      status : action == 'enable',
    },
  });
  event.target.classList.remove("loading");
  event.target.style.opacity = 1;
  event.target.disabled = false;
  if (data) {
    console.log(data.status);
    disableEnableButton.style.backgroundColor = data.status
      ? "#ec2b2b"
      : "#20e020";
    disableEnableButton.textContent = data.status
      ? "Disable Category"
      : "Enable Category";
    event.target.setAttribute(
      "data-action",
      data.status ? "disable" : "enable"
    );
  }
}

function addRemoveMoreSubTitle(event) {
  const button = event.target;
  const buttonContent = button.textContent;
  const buttonsParent = button.parentElement;
  const subTitleContainer = buttonsParent.parentElement;
  if (buttonContent == "+") {
    const nextElement = document.createElement("input");
    nextElement.setAttribute("required", true);
    nextElement.setAttribute("type", "text");
    nextElement.setAttribute("placeholder", "Add Sub Category Title");
    subTitleContainer.appendChild(nextElement);
  } else {
    const nextElement = buttonsParent.nextElementSibling;
    subTitleContainer.removeChild(nextElement);
  }
}

function addRemoveMoreCtrgyQstnsTitle(event, action) {
  console.log(addNewQstnTitleInputs.childNodes.length);
  if (action == "add") {
    const titleInputElement = document.createElement("input");
    titleInputElement.setAttribute("type", "text");
    titleInputElement.setAttribute("required", true);
    titleInputElement.setAttribute("placeholder", "Enter Question Title");
    addNewQstnTitleInputs.appendChild(titleInputElement);
  } else {
    if (addNewQstnTitleInputs.childElementCount > 1) {
      addNewQstnTitleInputs.removeChild(addNewQstnTitleInputs.lastElementChild);
    }
  }
}

function addRemoveMoreSubCtgryTitle(event, action) {
  const parentFormElement = event.target.closest("form");
  console.log(parentFormElement);
  if (action == "add") {
    const ctgryInputContainer = document.createElement("div");

    ctgryInputContainer.appendChild(titleInputElement);
  } else {
    if (addNewSubCtgryTitleInputs.childElementCount > 1) {
      addNewSubCtgryTitleInputs.removeChild(
        addNewSubCtgryTitleInputs.lastElementChild
      );
    }
  }
}

function createSubCtgryForRoot(event) {
  event.preventDefault();
  const inputElements = addNewSubCtgryTitleInputs.querySelectorAll("input");
  for (let index = 0; index < inputElements.length; index++) {
    console.log(inputElements[index].value);
  }
}

async function editPanelAddSubCtgryBtnHandler(event) {
  const rootid = event.target.getAttribute("data-rootid");
  const div = document.createElement("div");
  let selectHTML = "";
  JSON.parse(localStorage.getItem("country-list")).forEach(country =>{
    selectHTML += `<option value=${country.countryCode}>${country.countryName}</option>`
  })
  div.innerHTML =  `<form onsubmit="postNewRootSubCategory(event, ${rootid})" class="">
                            <div class="form-manadatory-elements">
                                <p>Enter Title for Sub-Category<i style="color: red;font-size: small;">*</i></p>
                                <input type="text" data placeholder="Enter Category Title" name="ctgrytitle" required>
                                <label for="countries">
                                    Choose Package (Optional)
                                </label>
                                <select name="countries" id="countrylist-subctgry" class="countrylist "
                                    onchange="selectedCountryInSubCtgry(event)">
                                    <option value="" selected disabled>Choose Country..</option>
                                    ${selectHTML}
                                </select>
                                <div class="login-required-radio">
                                    <p
                                        style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                                        Is Login Required<i style="font-size: smaller; color: red;">*</i></p>
                                    <label for="">
                                        <input type="radio" class="" name="loginrequire" value="true" required>
                                        Yes
                                    </label>
                                    <label for="">
                                        <input type="radio" class="" name="loginrequire" value="false" required>
                                        No
                                    </label>
                                </div>
                                <!-- <div class="has-child-radio">
                                    <p
                                        style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                                        Can Have Sub Category<i style="font-size: smaller; color: red;">*</i></p>
                                    <label for="">
                                        <input type="radio" class="" name="haschild" value="true" required>
                                        Yes
                                    </label>
                                    <label for="">
                                        <input type="radio" class="" name="haschild" value="false" required>
                                        No
                                    </label>
                                </div> -->
                            </div>
                            <div class="form-optional-elements">
                                <label for="description">
                                    Add description (If Any)
                                </label>
                                <input type="text" placeholder="Type here" id="" name="description">
                                <label for="page">
                                    Attach on Page (Optional)
                                </label>
                                <input type="text" placeholder="Type here" id="" name="page">
                                </select>
                            </div>
                            <button class="btn-loader" type="submit" id="add-ctgry-form-btn">Add Sub-Category</button>
                        </form>`
  event.target.parentElement.parentElement.appendChild(div);
  const { data } = await postRequest(
    `${base_URL}/faq/getctgry?ROOTID=${rootid}`
  );
  editPanelAddNewQstnFormContainer.classList.add("hide");
  editPanelAddSubCtgryFormContainer.classList.remove("hide");
}

async function editPanelAddNewQstnHandler(event) {
  const rootid = event.target.getAttribute("data-rootid");
  const formElement = makeAddQuestionForm(rootid, countryListSelect);
  event.target.parentElement.appendChild(formElement);
}

// function postNewRootCategory(event) {
//   event.preventDefault();

//   const title = document.getElementById('add-new-ctgry-input').value;
//   const loginRequired = document.querySelector('input[name="loginrequire"]:checked');

//   if (title && loginRequired) {

//       document.querySelector('.root-category-modal').style.display = 'flex';
//   } else {

//       alert('Please fill in all required fields.');
//   }
// }

// function closeModal() {
//   document.querySelector('.root-category-modal').style.display = 'none';
// }

// function chooseSubCategory() {

//   document.getElementById('add-ctgry-more-detail').style.display = 'block';

//   document.getElementById('create-new-ctgry-form-container').style.display = 'none';

//   closeModal();
// }

// function addQuestion() {
//   alert('Add Question clicked');
//   closeModal();
// }

async function postNewRootSubCategory(event, ctgryid) {
  event.preventDefault();

  // Get form values
  const ctgryTitle = event.target.ctgrytitle.value;
  const parentid =  ctgryid ||  document.getElementById("add-new-ctgry-id").getAttribute("data-ctgryid"); // Get parent ID
  const loginRequired = event.target.loginrequire.value;
  const description = event.target.description.value;
  const page = event.target.page.value;
  const pkgid = event.target?.pkgid?.value || null; // Assuming packageid is a field

  // Prevent submission if title is empty
  if (ctgryTitle == "") return;

  const ctgryData = {
    description,
    title: ctgryTitle,
    login: loginRequired == "true",
    page,
    isroot: false,
    child: true,
    parentid: parentid, // Parent ID,
    pkgid
  };

  console.log(ctgryData);

  // const addNewCtgryFormButton = document.getElementById("add-ctgry-form-btn");
  // addNewCtgryFormButton.classList.add("loading");
  // addNewCtgryFormButton.style.opacity = 0.5;
  // addNewCtgryFormButton.disabled = true;
  // addNewCtgryFormButton.textContent = "Adding...";

  try {
    const { data } = await postRequest(`${base_URL}/faq/setroot`, ctgryData);
  
    // console.log(data);

    if (data) {
      alert("Sub-category has been added successfully!");
      console.log("ENtered");
      event.target.page.value = "";
      event.target.description.value = "";
      event.target.loginrequire.value = "";
      event.target.ctgrytitle.value = ""

      if(!showAddSubCategoryModal(event.target)){
        appendAddQstnForm(event.target, data.faq_root_id);
      }
    } else {
      alert("Failed to add sub-category.");
    }
  } catch (error) {
    console.error("Error adding sub-category:", error);
    alert("An error occurred. Please try again.");
  }

  addNewCtgryFormButton.classList.remove("loading");
  addNewCtgryFormButton.style.opacity = 1;
  addNewCtgryFormButton.textContent = "Add";
  addNewCtgryFormButton.disabled = false;
}

async function postNewQuestion(event, ctgryId){
    event.preventDefault();

    // Get form values
    const qstnTitle = event.target.qstntitle.value;
    const ctgryid =  ctgryId || event.target.categorytitleid?.getAttribute("data-ctgryid") || document.getElementById("add-new-ctgry-id").getAttribute("data-ctgryid"); // Get parent ID
    const loginRequired = event.target.loginrequire?.value || "false";
    const description = event.target.description.value;
    const page = event.target.page.value;
    const pkgid = event.target?.pkgid?.value || null; // Assuming packageid is a field
    const answer = event.target.answer?.value;

    // Prevent submission if title is empty
    if (qstnTitle == "") return;
    if(ctgryid == null && page == "" && pkgid == null ) return alert("Please Provide at least one from Package, Page or Category")

    const qstnData = {
      description,
      title: qstnTitle,
      login: loginRequired == "true",
      page,
      ctgryid, // Parent ID,
      pkgid,
      answer
    };

    console.log(qstnData);

    const subBtn = event.target.querySelector("button[type='submit']");
    subBtn.classList.add("loading");
    subBtn.style.opacity = 0.5;
    subBtn.disabled = true;
    try {
      const { data } = await postRequest(`${base_URL}/faq/addqstn`, qstnData);
      console.log(data);
    } catch (error) {
      
    }
    subBtn.classList.remove("loading");
    subBtn.style.opacity = 1;
    subBtn.disabled = false;

}

function appendAddQstnForm(form, ctgryid, countryList){
  const formElement = makeAddQuestionForm(ctgryid, countryList);
  form.insertAdjacentElement("afterend",formElement);
  form.parentElement.removeChild(form);
}

// Function to show the modal with options to "Add More Sub-Category" or "Add Question"
function showAddSubCategoryModal(form) {
  // Show the modal (assuming you have a modal with id `subcategory-modal`)
  const modal = document.getElementById("subcategory-modal");
  modal.style.display = 'block'
  // modal.classList.remove("hidden"); // Show modal after the alert is confirmed

  // Handle "Add More Sub-Category" button click
  document
    .getElementById("add-more-subcategory-btn")
    .addEventListener("click", function () {
      resetForm(form); // Reset the form
      // modal.classList.add("hidden"); // Hide modal
      modal.style.display = 'none';
      return true;
    });

  // Handle "Add Question" button click
  document
    .getElementById("add-question-btn")
    .addEventListener("click", function () {
      // Logic for adding question goes here
      alert("You chose to add a question for this sub-category.");
      // modal.classList.add("hidden"); // Hide modal
      modal.style.display = 'none';
      return false;
    });

}

// Function to reset the form and make the parent ID ready for the next submission
function resetForm(form) {
  // Reset form fields
  // const form = document.getElementById("create-new-ctgry-form-container");
  form.reset(); // Reset all inputs

  // Set the parent ID to the value it was before
  // document.getElementById("add-new-ctgry-id").value = ""; // Reset parent ID field

  // Focus on the first input field (optional)
  // document.getElementById("ctgrytitle").focus();
}
