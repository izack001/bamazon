var mysql= require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host:"localhost",
    port:8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err){
    if (err) throw err;

    loadProduct();

})

buyingItems();


function buyingItems(){
    inquirer.prompt([
        {
            
            message: "Which item id would you like to buy?",
            type:"input",
            name: "id",
        },
        {
        
            message:"How many would you like to buy?",
            type:"input",
            name: "quantity",
        }
    ]).then(function(answers){
        var id= parseInt(answers.id)
        var amount=parseInt(answers.quantity);
        inventoryCount(id,amount);        
    });
}



var loadProduct = function(){
    connection.query("SELECT item_id,product_name,price FROM products",function(err,results){
        if (err) throw err;
        for (var i = 0; i < results.length;i++){

       
        console.log(results[i].item_id + "\n" + results[i].product_name + "\n" + results[i].price + "\n");
        }
        // process.exit()
    })
    
}

var inventoryCount = function(id,quantity){
    var theId=id;
    var theQuantity=quantity;
    console.log(theId);
    connection.query("SELECT item_id,stock_quantity,product_name,price FROM products WHERE item_id="+id,function(err,results){
        if (err) throw err;
        
        var resultArray = [];
        resultArray = (JSON.parse(JSON.stringify(results)));
        if(theId===resultArray[0].item_id){
            console.log("You picked "+resultArray[0].product_name);
            if(theQuantity <= resultArray[0].stock_quantity){
                console.log("You have purchased "+resultArray[0].product_name + ". It is " + resultArray[0].price);
                var newQuantity= theQuantity-resultArray[0].stock_quantity;
                connection.query("UPDATE products SET stock_quantity="+ theQuantity + " WHERE stock_quantity = "+ newQuantity,function(err,results){
                    if (err) throw err;
                    console.log("succesfull purchased an item");
                } )
            }
            else{
                console.log("Insufficient inventory!")
            }
        }
        else{
            console.log("Unknown item!")
        }

        

    })
    
    
}