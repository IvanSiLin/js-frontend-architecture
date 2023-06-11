// BEGIN
export default function collapse(companies) {

    const container = document.querySelector('.container');
  
    companies.forEach((company) => {

      const button = document.createElement('button');
      button.className = 'btn btn-primary';
      button.textContent = company.name;
      container.appendChild(button);
  
      button.addEventListener('click', () => {

        const existingDescription = container.querySelector('.description');
        
        if (existingDescription) {

          existingDescription.remove();
        }
  
        if (button.classList.contains('active')) {

          button.classList.remove('active');
        } else {

          const description = document.createElement('div');
          description.textContent = company.description;
          description.className = 'description';
          container.appendChild(description);
          button.classList.add('active');
        }
      });
    });
  }
// END