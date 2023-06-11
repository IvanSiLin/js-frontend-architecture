// BEGIN
const filterLaptops = (laptops, filters) => {

    const { processor_eq, memory_eq, frequency_gte, frequency_lte } = filters;
  
    return laptops.filter((laptop) => {

      if (processor_eq && laptop.processor !== processor_eq) {

        return false;
      }

      if (memory_eq && laptop.memory !== Number(memory_eq)) {

        return false;
      }

      if (frequency_gte && laptop.frequency < Number(frequency_gte)) {

        return false;
      }

      if (frequency_lte && laptop.frequency > Number(frequency_lte)) {

        return false;
      }

      return true;
    });
  };
  
  const renderLaptops = (laptops) => {

    const result = document.querySelector('.result');
    result.innerHTML = '';
  
    if (laptops.length === 0) {

      return;
    }
  
    const ul = document.createElement('ul');
    laptops.forEach((laptop) => {

      const li = document.createElement('li');
      li.textContent = laptop.model;
      ul.appendChild(li);
    });
  
    result.appendChild(ul);
  };
  
  const activateFilter = (laptops) => {

    const form = document.querySelector('form');
  
    const handleInputChange = () => {

      const filters = {

        processor_eq: form.elements.processor_eq.value,
        memory_eq: form.elements.memory_eq.value,
        frequency_gte: form.elements.frequency_gte.value,
        frequency_lte: form.elements.frequency_lte.value,
      };
  
      const filteredLaptops = filterLaptops(laptops, filters);
      renderLaptops(filteredLaptops);
    };
  
    form.addEventListener('input', handleInputChange);
    form.addEventListener('change', handleInputChange);
  };
  
  export default (laptops) => {
    
    activateFilter(laptops);
    renderLaptops(laptops);
  };
  // END
  