const newInputButton = document.getElementById("goodInput");
const inputGenerator = (function* () {
  for (let i = 2; i < 31; i++) {
    yield `newOffer${i}`;
  }
})();
newInputButton.addEventListener("click", (e) => {
  e.preventDefault();
  const generatedInput = inputGenerator.next();
  if(!generatedInput.done) {
    const newInput =  document.createElement('input');
    newInput.type = 'text';
    newInput.name = generatedInput.value;
    newInput.className+="form-control";
    newInput.placeholder='Введите название товара';
    const container = document.getElementById('offerInputsContainer');
    container.appendChild(document.createElement('br'));
    container.appendChild(newInput);
  }
});


