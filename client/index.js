

document.addEventListener('DOMContentLoaded', function(){
   fetch('http://localhost:5000/getAll')
   .then(response => response.json())
   .then(data => loadHTMLTable(data['data']));
    
});

const addBtn = document.querySelector('#add-name-btn');
const deletBtn = document.querySelector('.delete-row-btn');
const updateBtn = document.querySelector('#update-row-btn')
document.querySelector('table tbody').addEventListener('click', function(event){
    
   if (event.target.className === 'delete-row-btn'){
    deleteRowById(event.target.dataset.id);
   }

   if (event.target.className ==='edit-row-btn'){
    console.log("iam in edit");

     editRowById(event.target.dataset.id)
   }
});

function deleteRowById(id){
    fetch('http://localhost:5000/delete/' + id,{
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.success);
        if (data.success){
            console.log("in delete");
            // location.reload();
        }
    })
}

function editRowById(id){
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden=false;
    document.querySelector('#update-row-btn').dataset.id=id;
    document.querySelector('#update-name-input').dataset.id=id;

}
updateBtn.onclick = function(){
    const updatedNameInput = document.querySelector('#update-name-input');
    console.log("id "+updatedNameInput.dataset.id);
    fetch('http://localhost:5000/update' , {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body:JSON.stringify( {
            id : updatedNameInput.dataset.id,
            name: updatedNameInput.value
        })
        
    })

    .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success){
                location.reload();
            }
        })
}

addBtn.onclick = function(){
    const nameInput =document.querySelector('#name-input')
    const name = nameInput.value;
    nameInput.value = "";
    fetch('http://localhost:5000/insert' , {
    headers:{
        'Content-type' : 'application/json'
    },
    method: 'POST',
    body : JSON.stringify({name : name})

    })
    //get promise
    .then((response) =>response.json())
    .then(data => InsertRowIntoTable(data['data']));

}

function InsertRowIntoTable(data){
const table = document.querySelector('table tbody');
const isTableData = table.querySelector('.no-data');
let tableHtml = "<tr>";

for (var key in data){
    console.log(data[key]);
    if (data.hasOwnProperty(key)){
        if (key === 'date_added'){
            data[key] = new Date(data[key]).toLocaleDateString();
    console.log("in date added");
            
        }
    tableHtml +=`<td>${data[key]}</td>`;

    
    }
   

}
tableHtml +=`<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
tableHtml +=`<td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>`;
tableHtml +="</tr>"

if (isTableData){
    table.innerHTML = tableHtml;
    }else {
        const newRow = table.insertRow()
        newRow.innerHTML = tableHtml;
}
}


function loadHTMLTable(data){
    console.log(data);
    let tableHtml;
    const table = document.querySelector('table tbody');
    if (data.length === 0){
        table.innerHTML="<tr> <td class='no-data' colspan='5'> No Date </td></tr>";
        return;
    }
        data.forEach(({id , name ,date_added}) => {
            tableHtml +="<tr>";
            tableHtml +=`<td>${id}</td>`;
            tableHtml +=`<td>${name}</td>`;
            tableHtml +=`<td>${new Date(date_added).toLocaleDateString()}</td>`;
            tableHtml +=`<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
            tableHtml +=`<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
            tableHtml +="</tr>";


        });   
    table.innerHTML= tableHtml;

}