const body = document.body;

// body.classList.add("dark");

const themeSwitcher = document.getElementById("theme");

themeSwitcher.onchange = (e) => {
  const isChecked = e.target.checked;

  if (isChecked) {
    body.classList.remove("dark");
    body.classList.add("light");
  } else {
    body.classList.remove("light");
    body.classList.add("dark");
  }
}