# Web-API-Design-using-Node.js-and-Express-with-MongoDB
Used Node.js and Express to develop a Web API that provides services related to data stored in a MongoDB database. 
Built a Web API that allows applications to get information about the pets at the store and the pet toys that the store sells stored in MongoDB.

# First API:

## /findToy

**Parameters:**
id: >the ID of the Toy to find

**Example usage: `/findToy?id=1234`


**Description:** This API finds and returns the Toy in the “toys” collection with the ID that matches the id> parameter. It should return the entire Toy document/object, including all properties that are stored in the database.
If the id> parameter is unspecified, or if there is no Toy that has a matching ID, this API should return an empty object.

# Second API:

## /findAnimals

**Parameters:**
species: >the species of the Animals to find
trait: >one of the traits of the Animals to find
gender: >the gender of the Animals to find

**Example usage: `/findAnimals?species=Dog&trait=loyal&gender=female`


**Description:** This API finds all Animals in the “animals” collection that have a species and gender that match the species> and gender> parameters, respectively, and for which one of the Animal’s traits matches the trait> parameter

# Third API:

## /animalsYoungerThan

**Parameters:**
age: >the maximum age (exclusive) of the Animals to find

**Example usage: `/animalsYoungerThan?age=12`


**Description:** This API finds all Animals in the “animals” collection that have an age that is less than (but not equal to!) the age> parameter

## Fourth API:

# /calculatePrice

**Parameters: **
id[i]: >the ID of the i>th Toy to include in the calculation
qty[i]: >the quantity of the i>th Toy to include in the calculation

**Example usage: `/calculatePrice?id[0]=123&qty[0]=2&id[1]=456&qty[1]=3`


**Description:** This API calculates the total price of purchasing the specified quantities of the Toys with the corresponding IDs, using the Toys’ price from the database. For each i, >this API finds the Toy with the ID equal to the id[i]> parameter and determines the subtotal for that Toy by multiplying its price by the specified quantity qty[i]>. It then uses the subtotals for all Toys to calculate the total price.

