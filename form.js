document.addEventListener("DOMContentLoaded", function() {
  displayTableUserData();
  displayUserData(currentPage);
  toggleTable();
});

document.getElementById('name').addEventListener('input', function(event) {
  this.value = this.value.replace(/[^a-zA-Z -]/g, '');
});

document.getElementById('phone').addEventListener('input', function(event) {
  this.value = this.value.replace(/\D/g, '').substring(0, 10);
});


const userData = JSON.parse(localStorage.getItem('userDetails')) || [];
function validateForm() {
  var name = document.getElementById('name').value;
  var age = document.getElementById('age').value;
  var email = document.getElementById('email').value;
  var phone = document.getElementById('phone').value;

  var isValid = true;
  var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  var phoneRegex = /^[0-9]{10}$/;

  if (name === '' || email === '' || phone === '') {
      alert("Please enter all fields");
      isValid = false;
  } else if (name.length < 4) {
      alert("Username should contain at least 4 characters");
      isValid = false;
  } else if (!emailRegex.test(email)) {
      alert("Email address is not valid");
      isValid = false;
  } else if (!phoneRegex.test(phone)) {
      alert("Phone number should be 10 digits");
      isValid = false;
  }

  if (isValid) {
      
      const user = {
          name: name,
          email: email,
          phone: phone,
          age: age,
      };
      userData.push(user);
      localStorage.setItem("userDetails", JSON.stringify(userData));
      displayUserData(currentPage);
  }

  return isValid;
}
const tableBody = document.getElementById('tableBody');
function displayTableUserData() {  
  tableBody.innerHTML = ''; 

  userData.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${user.name}</td>
          <td>${user.age}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>
      `;
      tableBody.appendChild(row);
  }); 
}

const tbody = document.getElementById("tableBody");
let rowsPerPage = 5;
let currentPage = 1;
const paginationSelect = document.getElementById('pagination-column');

function paginationChange(){
  rowsPerPage = paginationSelect.value;
  console.log("pageChange");
  displayUserData(currentPage);
}

function displayUserData(page) {
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const rows = Array.from(document.querySelectorAll("#myTable tbody tr"));
  rows.forEach((row, index) => {
      if (index >= startIndex && index < endIndex) {
          row.style.display = 'table-row';
      } else {
          row.style.display = 'none';
      }
  });

  updatePagination(); 
}

const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
      currentPage--;
      displayUserData(currentPage);
  }
});

nextButton.addEventListener("click", () => {
  const lastPage = Math.ceil(tbody.querySelectorAll("tr").length / rowsPerPage);
  if (currentPage < lastPage) {
      currentPage++;
      displayUserData(currentPage);
  }
});

function updatePagination() {
  const lastPage = Math.ceil(tbody.querySelectorAll("tr").length / rowsPerPage);
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === lastPage;
}
function searchItem() {
  const filterSearchItem = document.getElementById('searchInput').value.toLowerCase();
  const rows = tableBody.querySelectorAll("tr");

  let count = 0;
  currentPage = 1; 

  rows.forEach((row) => {
    const user = userData[row.rowIndex - 1]; 

    const userValues = Object.values(user);
    let found = false;

    userValues.forEach((value) => {
      if (value.toString().toLowerCase().includes(filterSearchItem)) {
        found = true;
        return; 
      }
    });

    if ((found || filterSearchItem === "") && count < rowsPerPage) {
      row.style.display = "";
      count++;
    } else {
      row.style.display = "none";
    }
  });

  updatePagination();
}

var displayTable = document.getElementById("displayTable");
let showTable = document.getElementById('showTable');

function toggleTable() {
    if (displayTable.style.display === 'none') {

        displayTable.style.display = 'block';
        showTable.innerText ='Hide';
    } else {
        displayTable.style.display = 'none';
        showTable.innerText ='Show';

    }
}

const headers = document.querySelectorAll("#myTable th");
const sortingOrder = Array.from(headers).map(() => -1);
function toggleSortOrder(index) {
    
    sortingOrder[index] *= -1;

    headers.forEach(header => {
        header.querySelector("i.fa-caret-up").classList.remove("active");
        header.querySelector("i.fa-caret-down").classList.remove("active");
    });

    
    if (sortingOrder[index] === 1) {
        headers[index].querySelector("i.fa-caret-up").classList.add("active");
    } else {
        headers[index].querySelector("i.fa-caret-down").classList.add("active");
    }

    console.log(index);
    sortTable(index);
}


function sortTable(columnIndex) {
  const rows = Array.from(document.querySelectorAll("#myTable tbody tr"));
    console.log(rows);
    const sortedRows = rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].textContent.trim().toLowerCase();
        console.log("1",cellA);
        const cellB = rowB.cells[columnIndex].textContent.trim().toLowerCase();
        // console.log("2",cellB);
        return sortingOrder[columnIndex] * (cellA > cellB ? 1 : -1);
    });

    tableBody.innerHTML = "";

    
    sortedRows.forEach(row => {
        tableBody.appendChild(row);
    });
}

headers.forEach((header, index) => {
    header.addEventListener("click", () => {
        toggleSortOrder(index);
    });
});
