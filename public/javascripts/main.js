//I need to make the forme of register in my index.html load dynamically when clicking on the button register
// const register = document.getElementById("register");
// let registerDiv = document.querySelector(".register");
// const container = document.querySelector(".container");
// const loginButton = document.querySelector("#login");
// const loginDiv = document.querySelector(".login");

//we can decoded jwt token in js using jwt-decode

const container = document.createElement("div");
container.setAttribute("class", "container");

//register
const register = document.createElement("button");
register.setAttribute("id", "register");
register.setAttribute("class", "custom-btn btn-3");
const registerDiv = document.createElement("div");
registerDiv.setAttribute("class", "register");
const spanRegister = document.createElement("span");
spanRegister.textContent = "Register";

register.appendChild(spanRegister);
registerDiv.appendChild(register);
container.appendChild(registerDiv);

//login
const loginDiv = document.createElement("div");
loginDiv.setAttribute("class", "login");
const loginButton = document.createElement("button");
loginButton.setAttribute("class", "custom-btn btn-3");
loginButton.setAttribute("id", "login");
const spanLogin = document.createElement("span");
spanLogin.textContent = "Login";
loginButton.appendChild(spanLogin);
loginDiv.appendChild(loginButton);
container.appendChild(loginDiv);
container.style.setProperty("height", "90vh");

window.onload = () => {
  document.body.appendChild(container);
};

function registerForm(e) {
  registerDiv.innerHTML = "";
  container.innerHTML = "";
  registerDiv.classList.add("login-box");
  const form = document.createElement("form");
  form.setAttribute("action", "/users");
  form.setAttribute("method", "post");
  form.setAttribute("id", "registerForm");
  form.innerHTML = `
  <div class="user-box">
      <input type="text" id="name" name="name"  required/><br /><br />
  <label for="name">Name:</label>
      </div>
      <div class="user-box">
      <input type="email" id="registerEmail" name="email"  required/><br /><br />
      <label for="email">Email:</label>
      </div>
      <div class="user-box">
      <input type="password" id="registerPassword" name="password"  required /><br /><br />
      <label for="password">Password:</label>
      </div>
    
      <a href="#">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <input type="submit" value="GET STARTED" id="registerSubmit" class="no-style-button" />
    </a>
      <p class="ask">Do you have an acount ? <button onclick="loginForm()" class="no-style-button">Sing In</button>
        </p>`;
  registerDiv.appendChild(form);
  container.appendChild(registerDiv);
  document.body.appendChild(container);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    registerToken(e);
  });
}

function loginForm() {
  loginDiv.innerHTML = "";
  container.innerHTML = "";
  loginDiv.innerHTML = " <h2>Welcome Back!</h2>";
  const form = document.createElement("form");
  form.setAttribute("action", "/auth");
  form.setAttribute("method", "post");
  form.setAttribute("id", "loginForm");
  form.innerHTML = `
  <div class="user-box">
      <input type="email" id="loginEmail" name="email" required />
      <label for="email">Email:</label>
</div>
      <div class="user-box">
      <input type="password" id="loginPassword" name="password"required />
      <label for="password">Password:</label>
      </div>
      <a href="#">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <input type="submit" value="LOG IN" id="loginSubmit" class="no-style-button" />
    </a>
      <p class="ask">You don't have an acount ? <button onclick="registerForm()" class="no-style-button">Sing Up</button>
        </p>
     `;

  loginDiv.appendChild(form);
  loginDiv.classList.add("login-box");
  container.appendChild(loginDiv);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    loginToken(e);
  });
}
loginButton.addEventListener("click", loginForm);
register.addEventListener("click", registerForm);

function loginToken(e) {
  const email = document.querySelector("#loginEmail").value;
  const password = document.querySelector("#loginPassword").value;
  const user = {
    email: email,
    password: password,
  };
  fetch("/auth", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    //we need to convert the user object to a json string to send it to the server
    body: JSON.stringify(user),
  })
    .then((res) => {
      if (res.status == 400) {
        //will be executed if the email or the password is wrong
        e.target.submit();
      }
      return res;
    })
    .then((res) => {
      const token = res.headers.get("x-auth-token");
      localStorage.setItem("token", token);
      const user = parseJwt(token);
      if (user != null) isAuthentificated(user, email);
      else res.status(400).send("the user is not found");
    })
    .catch((err) => console.log("syntax", err));
}
//also when the user register we need to recieve the token and store it in the local storage
// we can't use post cause the user is already in the database so we need to use get and we use the email to search in the database
function registerToken(e) {
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#registerEmail").value;
  const password = document.querySelector("#registerPassword").value;
  const user = {
    name: name,
    email: email,
    password: password,
  };
  fetch(`/users`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    //we need to convert the user object to a json string to send it to the server
    body: JSON.stringify(user),
  })
    .then((res) => {
      if (res.status == 400) {
        e.target.submit();
      } else return res.headers.get("x-auth-token");
    })
    .then((token) => {
      localStorage.setItem("token", token);
      const user = parseJwt(localStorage.getItem("token"));
      // console.log(user);
      // if (user.email == email) {
      //   window.location.href = `/users/${user.iduser}`;
      // }
      isAuthentificated(user, email);
    })
    .catch((err) => console.log(err));
}

//decode the token
function parseJwt(token) {
  if (token == null) return null;
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

//the login function need to be executed if the submit is clicked
//we need to add the event listener to the form not to the button submit
//cause if we add it to the button submit the page will be reloaded and the data will be lost

function isAuthentificated(user, email) {
  if (user.email == email) {
    displayArticles(user);
  } else {
    document.body.innerHTML = "Error 404";
    fetch(`/`);
  }
}

//end of the login function

//start logout function

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

window.addEventListener("load", async () => {
  firstTime = true;
  const token = localStorage.getItem("token");
  if (token != null) {
    const user = parseJwt(token);
    displayArticles(user);
  }
});

//############################################################################################################
// start articles home
//start pagination

//this function just when the user is logged or registered

let totalPages = 20;
let page = 10;
// Create the pagination elements
const pagination = document.createElement("div");
pagination.classList.add("pagination");
const myPagination = document.createElement("div");
myPagination.classList.add("myPagination");

// creating required element
// Create the outer container element
const articlesContainer = document.createElement("div");
articlesContainer.classList.add("articlesContainer");

// Create the loading section
const loading = document.createElement("div");
loading.classList.add("loading");

// Create the load animation
const load = document.createElement("div");
load.classList.add("load");

// Create the three animated divs
const divOne = document.createElement("div");
divOne.classList.add("one");
const divTwo = document.createElement("div");
divTwo.classList.add("two");
const divThree = document.createElement("div");
divThree.classList.add("three");

const logoutnButton = document.createElement("button");
logoutnButton.setAttribute("class", "custom-btn btn-3");
logoutnButton.setAttribute("id", "logout");
logoutnButton.addEventListener("click", logout);
const spanLogout = document.createElement("span");
spanLogout.textContent = "Logout";
logoutnButton.appendChild(spanLogout);
// logoutnButton.addEventListener("click", logout);

async function displayArticles(user) {
  document.body.innerHTML = "";
  navbar();
  const logoutDiv = document.createElement("div");
  logoutDiv.setAttribute("class", "logout");
  logoutDiv.setAttribute(
    "style",
    "display:flex; justify-content: flex-end;width:100vw;position:fixed; top:0; right:0; padding: 10px; background-color:transparent; z-index: 100000; "
  );
  logoutnButton.setAttribute(
    "style",
    "margin-right: 10px; position:fixed; top:0; right:0; "
  );
  // logoutDiv.appendChild(logoutnButton);
  document.body.appendChild(logoutnButton);

  // Nest the divs inside the load animation
  load.appendChild(divOne);
  load.appendChild(divTwo);
  load.appendChild(divThree);

  // Nest the load animation inside the loading section
  loading.appendChild(load);

  // Nest the pagination elements inside the articles container
  const el = addArticle();
  document.body.appendChild(el[0]);
  document.body.appendChild(el[1]);
  articlesContainer.appendChild(loading);
  articlesContainer.appendChild(pagination);
  articlesContainer.appendChild(myPagination);
  document.body.appendChild(articlesContainer);
  await createPagination(totalPages, page);
  fetchPosts(page);
  order();
}
const element = document.createElement("ul");

//calling function with passing parameters and adding inside element which is ul tag
async function createPagination(totalPages, page) {
  loading.style.setProperty("display", "flex");
  await fetchPosts(page);
  loading.style.setProperty("display", "none");

  // await there();
  let liTag = "";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
  if (page > 1) {
    //show the next button if the page value is greater than 1
    liTag += `<li class="btn prev" onclick="createPagination(totalPages, ${
      page - 1
    })"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
  }

  if (page > 2) {
    //if page value is greater than 2 then add 1 after the previous button
    liTag += `<li class="first numb" onclick="createPagination(totalPages, 1)"><span>1</span></li>`;
    if (page > 3) {
      //if page value is greater than 3 then add  (...) after the first li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
  }

  // how many pages or li show before the current li
  if (page == totalPages) {
    //with 20 we want also 17
    beforePage = beforePage - 2;
  } else if (page == totalPages - 1) {
    beforePage = beforePage - 1;
  }
  // how many pages or li show after the current li
  if (page == 1) {
    afterPage = afterPage + 2;
  } else if (page == 2) {
    afterPage = afterPage + 1;
  }

  for (var plength = beforePage; plength <= afterPage; plength++) {
    if (plength > totalPages) {
      //if plength is greater than totalPage length then break
      break;
    }
    if (plength == 0) {
      //if plength is 0 than add +1 in plength value
      continue;
    }
    if (page == plength) {
      //if page is equal to plength than assign active string in the active variable
      active = "active";
    } else {
      //else leave empty to the active variable
      active = "";
    }
    liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><span>${plength}</span></li>`;
  }

  if (page < totalPages - 1) {
    //if page value is less than totalPage value by -1 then show the last li or page
    if (page < totalPages - 2) {
      //if page value is less than totalPage value by -2 then add this (...) before the last li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
    liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
  }

  if (page < totalPages) {
    //show the next button if the page value is less than totalPage(20)
    liTag += `<li class="btn next" onclick="createPagination(totalPages, ${
      page + 1
    })"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
  }
  element.innerHTML = liTag; //add li tag inside ul tag
  return liTag; //reurn the li tag
}
//end pagination
var posts, users, comments;
// const myPagination = document.querySelector(".myPagination");
let fetchPosts = async (number) => {
  myPagination.innerHTML = "";
  document.body.style = "background-color:rgb(32, 178, 170, 0)";
  myPagination.style = "background-color:rgb(32, 178, 170, 0)";
  if (firstTime == true && localStorage.getItem("token") != null) {
    firstTime = false;
    comments = await fetch("/commentaires").then(async (response) => {
      let myData = await response.json();
      return myData;
    });
    users = await fetch("/users").then(async (response) => {
      let myData = await response.json();
      return myData;
    });
    posts = await fetch("/articles").then(async (response) => {
      let myData = await response.json();
      return myData;
    });
  }
  // let posts = await fetch("/articles").then(async (response) => {
  //   let myData = await response.json();
  //   return myData;
  // });
  // let users = await fetch("/users").then(async (response) => {
  //   let myData = await response.json();
  //   return myData;
  // });
  // let comments = await fetch("/commentaires").then(async (response) => {
  //   let myData = await response.json();
  //   return myData;
  // });
  // let i = 0;
  for (let j = number * 5 - 5; j < number * 5; j++) {
    // console.log(j);
    let post = posts[j];
    const { iduser, idarticle, title, content } = post;
    for (let i = 0; i < users.length; i++) {
      if (users[i].iduser == iduser) {
        userName = users[i].name;
        break;
      }
    }
    var mainDivComments = "<div>";
    let allComments = async () => {
      // console.log(comments);
      for (let i = 0; i < comments.length; i++) {
        if (idarticle == comments[i].idarticle) {
          const name = () => {
            // console.log(users);
            for (let k = 0; k < users.length; k++) {
              if (users[k].iduser == comments[i].iduser) return users[k].name;
            }
            return "";
          };
          if (name() == "") continue;
          let commentOwner = `<h4 style=''>${name()}</h4>`;
          mainDivComments += commentOwner;
          let p =
            "<p style='text-align:center ; border-bottom:1px solid rgb(32, 178, 170, 0.9) ; margin-bottom:20px; padding-bottom : 10px ; line-height:1.8;'>";
          p += comments[i].contenu + "</p>";
          mainDivComments += p;
        }
      }
      mainDivComments += "</div>";
    };
    allComments();

    myPagination.innerHTML += `<div class="card" style="max-width: 50rem; background-color: #fff ; margin : 10px auto;padding:0 10px 10px">
    <img src="http://picsum.photos/800/300?${iduser}" class="card-img-top" alt="...">
    <div class="card-body">
    <h3 class="card-title" >${userName}</h3>
      <h5 class="card-title" >${title}</h5>
      <p class="card-text">${content}</p>
    </div>
    <p>
    <button class="btn btn-primary" type="button" style="margin:0 auto ; display : block; width:fit-content ; background-color:rgb(32, 178, 170)" data-bs-toggle="collapse" data-bs-target="#collapseExample${post.idarticle}" aria-expanded="false" aria-controls="collapseExample">
    show comments
    </button>
    </p>
    <div class="collapse" id="collapseExample${post.idarticle}">
      <div class="card card-body">
    ${mainDivComments}
      </div> </div>
 
    </div>`;
  }
  // myPagination.style = "background-color:rgb(32, 178, 170, 0.3)";
  // document.body.style = "background-color:rgb(32, 178, 170, 0.09)";
};

const hidAnimation = () => {
  loading.style.setProperty("display", "none");
};

const order = async () => {
  await fetchPosts(10);
  element.innerHTML = createPagination(totalPages, page);
  pagination.append(element);
  hidAnimation();
};

//end articles home

//navbar#############################

function navbar() {
  // Create the navBar element
  const navBar = document.createElement("div");
  navBar.classList.add("navBar");
  navBar.style = "margin-top:10px";

  // div contain the heading and a slogan
  const divSlogan = document.createElement("div");
  divSlogan.style =
    "display: flex; flex-direction: column; margin-left: 20px; justify-content: center; align-items: center;";
  const slogan = document.createElement("span");
  slogan.textContent = "Enjoy Your Reading";
  slogan.style = "font-size: 12px; color: #fff;";
  // Create the heading element
  // const heading = document.createElement("h2");
  // heading.textContent = "Blog";
  const img = document.createElement("img");
  img.setAttribute("src", "../images/logo.png");
  img.setAttribute("width", "50px");

  // Append the heading and slogan elements to the div element
  divSlogan.appendChild(img);
  divSlogan.appendChild(slogan);

  // Create the section element
  const section = document.createElement("section");

  // Create the search input element
  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "search");
  searchInput.setAttribute("placeholder", "search");
  const i = document.createElement("i");
  //<i class="fa-solid fa-bars"></i>
  i.setAttribute("class", "fa-solid fa-magnifying-glass");
  i.style = "font-size: 20px; color: #fff; position: absolute; right: 20px";

  // Create the profile image element
  const profileImage = document.createElement("img");
  // profileImage.setAttribute("src", "../images/profile.png");
  profileImage.classList.add("profile");

  // Append the search input and profile image elements to the section element
  section.appendChild(searchInput);
  section.appendChild(profileImage);
  section.appendChild(i);

  // Append the heading and section elements to the navBar element
  navBar.appendChild(divSlogan);
  navBar.appendChild(section);
  document.body.appendChild(navBar);
}
//we need to execute the function if the current page!= index.html
if (window.location.href != "/") {
  navbar();
}

//add article ###############

function addArticle() {
  // Create the addPostInput element
  const addArticleInput = document.createElement("div");
  addArticleInput.classList.add("addArticleInput");

  // Create the section element
  const section = document.createElement("section");

  // Create the profile image element
  const profileImage = document.createElement("img");
  profileImage.setAttribute("src", "images/proFile.png");
  profileImage.setAttribute("width", "30px");
  profileImage.classList.add("userProfileImage");

  // Create the input element
  const input = document.createElement("input");
  input.setAttribute("id", "textInput");
  input.setAttribute("placeholder", "write something here");
  input.setAttribute("type", "text");
  input.setAttribute("maxlength", "80");

  //           <i class="fa-solid fa-magnifying-glass"></i>
  const i = document.createElement("i");
  i.setAttribute("class", "fa-solid fa-magnifying-glass");
  i.style =
    "font-size: 20px; color: #fff; position: absolute; right: 20px;font-weight: 900;";
  input.appendChild(i);

  // Append the profile image and input elements to the section element
  section.appendChild(profileImage);
  section.appendChild(input);

  // Create the POST button
  const articleAddButton = document.createElement("button");
  articleAddButton.classList.add("articleAddBtn");
  articleAddButton.setAttribute("type", "submit");
  articleAddButton.textContent = "Share";

  // Append the section and postButton elements to the addPostInput element
  addArticleInput.appendChild(section);
  addArticleInput.appendChild(articleAddButton);

  // Create the Posts element
  const articlesElement = document.createElement("div");
  articlesElement.setAttribute("id", "Posts");
  articlesElement.classList.add("Posts");
  return [addArticleInput, articlesElement];
}
