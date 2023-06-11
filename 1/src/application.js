// BEGIN
export default function calculatorSum() {

    const form = document.querySelector('form');
    const input = document.querySelector('input[name="number"]');
    const result = document.getElementById('result');
  
    form.addEventListener('submit', (event) => {

      event.preventDefault();
      const value = parseInt(input.value);
      const currentResult = parseInt(result.textContent);
      result.textContent = currentResult + value;
      input.value = '';
      input.focus();
    });
  
    const resetButton = document.querySelector('button[type="button"]');
    resetButton.addEventListener('click', () => {
        
      result.textContent = '0';
      input.value = '';
      input.focus();
    });
  
    input.focus();
  }
// END