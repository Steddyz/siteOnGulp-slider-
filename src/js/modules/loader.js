function loader() {
  const loader = document.querySelector("#loader");

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("loader-wrapper--hidden");
    }, 500);
  });
}

export default loader;
