//Global variabes
let customerDish = {};

async function submitDish() {
    if (validity()){
        // get user's menu
        customerDish = getUserInput();

        // write menu to database
        await createDishRecord(customerDish);

        clearTable();
        getAllDishes();
        clearForm();
    }
}

//fucntion to take in data from the user input and storing in into an object.
function getUserInput(){
    return {
        dishNumber: document.getElementById("dishNumber").value,
        dishName: document.getElementById("dishName").value,
        veganSuitability: document.getElementById("veganSuitability").value,
        dishPrice: document.getElementById("dishPrice").value
    };
}

async function createDishRecord(dish){
    await fetch("http://localhost:8081/createMenu", { //Make request
            method: "POST",
            body: JSON.stringify(dish),
            headers: {
                'Content-Type': "application/json"
            }
        }).then(response => {   // Receive response
            return response.json(); // Convert response body to json
        }).then(data => {
            console.log(data);
        }).catch(error => console.log(error));
}

// Get all dishes from database
function getAllDishes(){
    fetch("http://localhost:8081/getMenu")
        .then(response => response.json())
        .then(dishes => {
            // for each dish in database add it to table
            dishes.forEach(function(dish) {
                addNewDish(dish);
            });
        }).catch(error => console.error(error));
}

// Populate table with dish
function addNewDish(dish){
    let table = document.getElementById("menuDishes").getElementsByTagName('tbody')[0];
    let newRow = table.insertRow(table.length);
    cella = newRow.insertCell(0);
    cella.innerHTML = dish.id;
    cellb = newRow.insertCell(1);
    cellb.innerHTML = dish.dishNumber;
    cellc = newRow.insertCell(2);
    cellc.innerHTML = dish.dishName;
    celld = newRow.insertCell(3);
    celld.innerHTML = dish.veganSuitability;
    celle = newRow.insertCell(4);
    celle.innerHTML = dish.dishPrice;
    cellf = newRow.insertCell(5);
    cellf.innerHTML = '<a onClick="editDish('+ dish.id +')">Edit</a>';
    cellg = newRow.insertCell(6);
    cellg.innerHTML = '<a onClick="deleteDish(this,'+ dish.id+')">Delete</a>';
}


//delete database record and remove entry from tabSle
function deleteDish(td, id) {
    if (confirm("Are you sure you want to delete Dish")) {
        row = td.parentElement.parentElement;
        document.getElementById("menuDishes").deleteRow(row.rowIndex);
        fetch("http://localhost:8081/removeMenu/"+id, { //Make request
            method: "DELETE"
        }).then(menu => { 
                console.log(menu);
        }).catch(error => console.log(error));

        clearForm();
    }
}

//update database record with user input
async function editDish(id){
    // get user's menu
    customerDish = getUserInput();

    // UPDATE
    await fetch("http://localhost:8081/updateMenu?id=" + id, { //Make request
        method: "PUT",
        body: JSON.stringify(customerDish),
        headers: {
            'Content-Type': "application/json"
        }
    }).then(response => {   // Receive response
        return response.json(); // Convert response body to json
    }).then(data => { //json data from previous .then()
        console.log(data);
    }).catch(error => console.log(error));

    clearTable();
    getAllDishes();
    clearForm();
}

//clear previous dish entry
function clearForm() {
    document.getElementById("dishNumber").value="";
    document.getElementById("dishName").value="";
    document.getElementById("veganSuitability").value="";
    document.getElementById("dishPrice").value="";
    selectedRow = null;
}

// clear all rows in the table
function clearTable(){
    let table = document.getElementById("menuDishes");
    let rowCount = table.rows.length;
    for (let i = 1; i < rowCount; i++) {
        table.deleteRow(1);
    }
}

//Ensuring that Primary key 'Dish Number' and Secondary key 'Dish Name' is not null. 
function validity(){
    validDish = false;
    if (!document.getElementById("dishNumber").value =="" || document.getElementById("dishName").value ==""){
        validDish = true;
        document.getElementById("valueValidationError").classList.remove("hide");
    }else {
        validDish = false;
        if (document.getElementById("valueValidationError").classList.contains("hide"))
            document.getElementById("valueValidationError").classList.add("hide");
    }
    return validDish;
}
