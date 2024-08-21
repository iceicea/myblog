function ajax(url) {
  let xhr = new XMLHttpRequest();
  xhr.open("get", url);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.send < 300) {
        console.log(xhr.responseText);
      }
    }
  };
  xhr.send(null);
}
