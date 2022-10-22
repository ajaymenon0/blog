const body = document.body;

const settingsBtn = document.getElementById("settings");
const sidebar = document.getElementById("sidebar");
const themeSwitcher = document.getElementById("theme");

if("serviceWorker" in navigator){
  const swPath = new RegExp(/localhost/g).test(window.location.host) ? "/service_worker.js" : "/blog/service_worker.js";
  navigator.serviceWorker.register(swPath).then(() => {
    // console.log("SW Registered!");
  }).catch(error=>{
    console.log("SW Registration Failed");
  });
} else{
  console.log("Not supported");
}

if (themeSwitcher) {
  themeSwitcher.onchange = (e) => {
    const isChecked = e.target.checked;
  
    if (isChecked) {
      localStorage.setItem("theme", "light");
      checkAndSetTheme();
    }
    else {
      localStorage.setItem("theme", "dark");
      checkAndSetTheme();
    }
  }
}

const setLightTheme = () => {
  body.classList.remove("dark");
  body.classList.add("light");
}

const setDarkTheme = () => {
  body.classList.remove("light");
  body.classList.add("dark");
}

const checkAndSetTheme = () => {
  const getTheme = localStorage.getItem("theme") || "light";
  if (getTheme === "light") setLightTheme();
  else setDarkTheme();
}

if (settingsBtn) {
  settingsBtn.onclick = e => {
    e.preventDefault();
    const isHidden = sidebar.classList.contains("hidden");
    if (isHidden) sidebar.classList.remove("hidden")
    else sidebar.classList.add("hidden");
  }
}

(function () {
  checkAndSetTheme();
  const getTheme = localStorage.getItem("theme") || "light";
  if (themeSwitcher) {
    if (getTheme === "light") themeSwitcher.checked = true;
    else themeSwitcher.checked = false;
  }
})();

// Progress bar 
const progressBar = document.getElementById('progress-bar');

if(progressBar) {
  let processScroll = () => {
    const docElem = document.documentElement;
    const scrollTop = docElem['scrollTop'];
    const scrollBottom = body['scrollHeight'] - window.innerHeight;
    const scrollPercent = scrollTop / scrollBottom * 100 + '%';

    progressBar.style.setProperty("--progress", scrollPercent); 
  }
  
  document.addEventListener('scroll', processScroll);
}

// Cherry picked from https://github.com/dombrant/blurry-image-load/
const loadImages = () => {
  const images = document.querySelectorAll(".blurry-load");

  for (let image of images) {
    const currentImage = new Image();
    currentImage.src = image.getAttribute("data-src");

    currentImage.onload = () => {
      image.src = currentImage.src;
      image.classList.add("blur-out");
      image.classList.remove("blurry-load");
    };
  }
}


document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    loadImages();
  }
};

