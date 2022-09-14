const body = document.body;

const settingsBtn = document.getElementById("settings");
const sidebar = document.getElementById("sidebar");
const themeSwitcher = document.getElementById("theme");

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