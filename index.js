//loads expressjs module
const express  =require('express')

//create expressjs server
const app = express()
const port = 4000

//Handling reqeusts, parses JSON to JSO
app.use(express.json())

let users = [
	{
		userId: 11,
		email:"jeremiah432@gmail.com",
		password:"jadelyn2424",
		isAdmin: false,
	},
	{
		userId: 22,
		email:"synnegal@gmail.com",
		password:"Possumtheeater",
		isAdmin: false	
	},
	{
		userId: 33,
		email:"bigbrother1414@yahoo.com",
		password:"wodota",
		isAdmin: false
	}]

let products = [
{
	name: "Apple",
	description: "A delicious food",
	price: 10,
	isActive: true,
	createdOn: Date(),
},
{
	name: "Samsung Phone",
	description: "A phone made by Samsung",
	isActive: true,
	createdOn: Date(),
},
{
	name: "LG Aircon",
	description: "An aircon made by LG",
	price: 7000,
	isActive: true,
	createdOn: Date()
},
{
	name: "Mystery Package",
	description: "No one knows what's in it...",
	price: 20000,
	isActive: false,
	createdOn: Date()
}]

let orders = [
	{
		userId: 11,
		products: [
		{
			name: "LG Aircon",
			description: "An aircon made by LG",
			price: 7000,
			isActive: true,
			createdOn: Date()
		},{
			name: "Apple",
			description: "A delicious food",
			price: 10,
			isActive: true,
			createdOn: Date()
		}],
		totalAmount: 7010,
		purchasedOn: Date()
	}, 
	{
		userId: 22,
		products: [
		{
			name: "Samsung Phone",
			description: "A phone made by Samsung",
			price: 1900,
			isActive: true,
			createdOn: Date()
		},{
			name: "Apple",
			description: "A delicious food",
			price: 10,
			isActive: true,
			createdOn: Date()
		}],
		totalAmount: 1910,
		purchasedOn: Date()
	},
	{
		userId: 33,
		products: [
		{
			name: "Samsung Phone",
			description: "A phone made by Samsung",
			price: 1900,
			isActive: true,
			createdOn: Date()
		},{
			name: "LG Aircon",
			description: "An aircon made by LG",
			price: 7000,
			isActive: true,
			createdOn: Date()
		}],
		totalAmount: 8900,
		purchasedOn: Date()
	}]

let loggedUser
let inactiveprod = [
{
	name: "Mystery Package",
	description: "No one knows what's in it...",
	price: 20000,
	isActive: false,
	createdOn: "1/1/1988"
}
	]


app.get("/users", (req, res) => {
	res.status(200).send(users)
})

app.post('/users/register', (req, res) => {
	//Debug
	console.log(req.body)
	//Create newUser instance 
	let newUser = {
		userId: req.body.userId,
		email: req.body.email,
		password: req.body.password,
		isAdmin: req.body.isAdmin
	}
	users.push(newUser)
	console.log(users)

	res.status(201).send("Account creation Success")
})

//login stuff
app.post('/users/login', (req, res) => {
	//Debugging, must contain user + pass
	console.log(req.body)

	//Find user with exact user and name in post body
	let detectUser = users.find((user) => {
		return user.email === req.body.email && user.password === req.body.password
	})
if(detectUser !== undefined) {
	//Returns index of an arr, similar to users.find()
	let detectUserIndex = users.findIndex((user) => {
		return user.email === detectUser.email
	})
	//Rewrites index of foundUserIndex
	detectUser.index = detectUserIndex
	//Temporarily log user in
	loggedUser = detectUser
	//Debugging
	console.log(loggedUser)
	res.status(200).send("Logged in")
} else {
	loggedUser = detectUser
	res.status(401).send("Login Failed")
}
})

//-----------------------------------------PRODUCTS-------------------------------------
//GET request is sent to the /products endpoint
//API retrieves all active products and returns them in its response.
app.get('/products', (req, res) => {
	console.log(loggedUser)
	//Pushes all active products so that output returns all products where value of isActive === true
	let activeProducts= products.filter((product)=>product.isActive === true)
	res.status(200).send(activeProducts)
})



app.post('/products', (req, res) => {
	if(loggedUser.isAdmin === false) {
		//For single array
		res.status(403).send("Unauthorized access. Not an admin!")
		 } else if (!Array.isArray(req.body) && loggedUser.isAdmin === true) {
     		let newProd = {
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			isActive: true,
			createdOn: Date()
		}
		products.push(newProd)
		res.status(200).send(products)
    }	else if (Array.isArray(req.body) && loggedUser.isAdmin === true) {
      		let newProducts = req.body.map((products) => {
      		return {
        	name: products.name,
        	description: products.description,
        	price: products.price,
        	isActive: true,
        	createdOn: Date()
      	} 
      	})
    products.push(...newProducts);
    console.log(products);

    res.status(201).send("Successfully created product/s!!");
    } else {
    	res.status(500).send("this error should never occur!")
    }
})

//A GET request is sent to the /products/:productId endpoint.
//API retrieves product that matches productId URL parameter and returns it in its response.
app.get('/products/:productId', (req,res) => {
		//Debugging
		console.log(req.params)
		console.log(req.params.productId)
		let productId = parseInt(req.params.productId)
		let product = products[productId]
		if (productId < products.length) {
			res.status(200).send(products[productId]) 
		} else {
			res.status(404).send("Product does not exist!")
		}
	})


//API Updates object
app.put('/products/:productId', (req,res) => {
		//Debugging
		console.log(req.params)
		console.log(req.params.productId)
		if(loggedUser.isAdmin === true) {
			let productId = parseInt(req.params.productId)
		let product = products[productId]
		if (productId < products.length) {
			let newProd = {
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			isActive: true,
			createdOn: req.body.createdOn
		}
		products[productId] = newProd
		res.status(200).send("Product edited!")
		} 
		} else {
			res.status(403).send("Unauthorized! You must be an admin to do so")
		}
	})

//Soft deletes the product?
app.delete('/products/archive/:productId', (req,res) => {
	console.log(req.params)
	console.log(req.params.productId)
	let prodIndex = parseInt(req.params.productId)
	if(loggedUser.isAdmin === true) {
		if(products[prodIndex].isActive === true) {
		console.log(products[prodIndex])
		products[prodIndex].isActive = false
		inactiveprod.push(products[prodIndex])
		res.status(200).send("Product Archived")			
		} else {
		res.status(404).send("Error! Product is either not active or not found in the database!")
		}
	} else {
		res.status(403).send("User permissions have denied you from accessing this!")
	}
})

//Shows all archived products for soft deletion
app.get('/archive', (req, res) => {
	res.status(200).send(inactiveprod)
}) 


//----------------------------------------------ORDERS---------------------------------------------------
//A GET request containing a its header is sent to the /users/orders endpoint.
//API validates user is an admin, returns false if validation fails.
//If validation is successful, API retrieves all orders and returns them in its response.
app.get('/users/orders', (req, res) => {
	if(loggedUser.isAdmin === true) {
		res.status(200).send(orders)
	} else {
		res.status(403).send("Error 403: Unauthorized access")
		return false
	}	
})

app.delete('/users/orders/:index', (req, res) => { 
	let index = parseInt(req.params.index)
	if(loggedUser.userId === orders[index].userId) {
		console.log(orders[index])
		orders.splice(index, 1)
		res.status(200).send("Item deleted!")
	} else {
		res.status(403).send("You do not have permissions to delete this!")
	}
})


app.listen(port, () => console.log(`Server is running at port ${port}`))