const form = document.getElementById('userForm');
const editIdInput = document.getElementById('editId');

form.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const rollnum = document.getElementById('rollnum').value;
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const email = document.getElementById('email').value;

   
    const data = {
        studentRollNumber: rollnum,
        studentName: name,
        studentAge: parseInt(age), 
        studentEmail: email
    };

   
    const editId = editIdInput.value;

    if (editId) {    
        updateStudent(editId, data);
    } else {
        addStudent(data);
    }
});


function addStudent(data) {
    fetch('http://localhost:5134/api/Students', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8' 
        },
        body: JSON.stringify(data), 
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(`Error ${response.status}: ${text}`); });
        }
        return response.json(); 
    })
    .then(jsonResponse => {
        console.log('Data posted successfully:', jsonResponse);
        refreshTable();
        form.reset();
    })
    .catch(error => {
        console.error('Error posting data:', error);
    });
}


function updateStudent(studentId, data) {
    fetch(`http://localhost:5134/api/Students/${studentId}`, { 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8' 
        },
        body: JSON.stringify({ studentId: parseInt(studentId), ...data }), 
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(`Error ${response.status}: ${text}`); });
        }
        return response.json(); 
    })
    .then(jsonResponse => {
        console.log('Data updated successfully:', jsonResponse);
        refreshTable();
        form.reset();
        editIdInput.value = ''; 
    })
    .catch(error => {
        console.error('Error updating data:', error);
    });
    location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    refreshTable();
});

function refreshTable() {
    const tableBody = document.querySelector('#dataTable tbody');
    
    fetch('http://localhost:5134/api/Students')
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = ''; 
            data.forEach((item) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.studentRollNumber}</td>
                    <td>${item.studentName}</td>
                    <td>${item.studentAge}</td>
                    <td>${item.studentEmail}</td>
                    <td>
                        <button onclick="editData(${item.studentId}, '${item.studentRollNumber}', '${item.studentName}', ${item.studentAge}, '${item.studentEmail}')" class="btn btn-warning btn-sm">Edit</button> 
                        <button onclick="deleteData(${item.studentId})" class="btn btn-danger btn-sm">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
}

function editData(studentId, rollnumber, name, age, email) {

    document.getElementById('rollnum').value = rollnumber;
    document.getElementById('name').value = name;
    document.getElementById('age').value = age;
    document.getElementById('email').value = email;
    editIdInput.value = studentId; 
}

function deleteData(studentId) {
    fetch(`http://localhost:5134/api/Students/${studentId}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                refreshTable(); 
            } else {
                console.error('Error deleting student:', response.statusText);
            }
        });
}