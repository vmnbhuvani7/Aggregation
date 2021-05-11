// Aggregation stage overview
// $match $group  $sort $count $skip $out $project $limit 

db.getCollection('aggregation').aggregate([
    { $match: { age: { $gte: 40 } } } //find record to all have age is 40 or above
])

db.getCollection('aggregation').aggregate([
    { $match: { tags: { $size: 4 } } } //tags in array and find 4 size
])

db.getCollection('aggregation').aggregate([
    { $group: { _id: { age: "$age", gender: "$gender" } } }  // unique value show
])

db.getCollection('aggregation').aggregate([
    { $group: { _id: "$company.location.address" } }
])

db.getCollection('aggregation').aggregate([
    { $group: { _id: "$gender" } } //male and female
])

db.getCollection('aggregation').aggregate([
    { $match: { gender: "male" } }, //first only find male record 
    { $group: { _id: { location: "$company.location", gender: "$gender" } } } // then after group to location 
])

db.getCollection('aggregation').aggregate([
    { $match: { gender: "male" } }, //first only find male record 
    { $group: { _id: { location: "$company.location", gender: "$gender" } } }, // then after group to location 
    { $count: "total" } //total count record
])

db.getCollection('aggregation').aggregate([
    { $match: { age: { $gte: 25 } } }, //first only find male record 
    { $group: { _id: { eyeColor: "$eyeColor", gender: "$gender" } } }, // then after group to location 
    { $count: "total" } //total count record
])

db.getCollection('aggregation').aggregate([
    { $match: { age: { $gte: 25 } } },
    { $sort: { age: 1 } },
])

db.getCollection('aggregation').aggregate([
    { $sort: { age: -1, name: 1 } }, //first age sort then after name field sort in age result
])

db.getCollection('aggregation').aggregate([
    { $project: { name: 1 } } // select only name filed and _id by default show 
])

db.getCollection('aggregation').aggregate([
    { $project: { name: 1, _id: 0 } } // select only name filed
])


db.getCollection('aggregation').aggregate([
    {
        $project: {
            name: 1,
            _id: 0,
            index: 1,
            info: {     // also add some new filed 
                eyes: "$eyeColor",
                company: "$company.title",
                country: "$company.location"
            }
        }
    }
])

db.getCollection('aggregation').aggregate([
    { $limit: 100 },    // first 100 record take
    { $match: { age: { $gte: 25 } } },
    { $sort: { age: 1 } },
    { $count: "total" }
])

db.getCollection('aggregation').aggregate([
    { $unwind: "$tags" }, //array distribute to particular single record
    { $project: { name: 1 } }
])

// $sum $avg $min $max only used in $group 

db.getCollection('aggregation').aggregate([
    {
        $group: {
            _id: "$favoriteFruit",
            count: { $sum: 1 }
        }
    }
])

db.getCollection('aggregation').aggregate([
    { $unwind: "$tags" },
    {
        $group: {
            _id: "$tags",
            count: { $sum: 1 }
        }
    }
])

db.getCollection('aggregation').aggregate([
    {
        $group: {
            _id: "$favoriteFruit",
            avgAge: { $avg: "$age" }
        }
    }
])

// unary operator 
// $type $or $gt $lt $and $multiply

db.getCollection('aggregation').aggregate([
    {
        $project: {
            name: 1,
            eyeColorType: { $type: "$eyeColor" }
        }
    }
])

// lookup aggregation https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/

db.getCollection('orders').aggregate([
    {
        $lookup:
        {
            from: "inventory", // other table name
            localField: "item", // order table filed name which one we can match
            foreignField: "sku", // inventory table match filed name
            as: "inventory_docs" // new name
        }
    }
])

//update 

db.getCollection('shoppingCard').update(
    { index: 2 },
    {
        $set: {
            cartId: NumberInt(325),
            customer: {
                name: "Mike Foster",
                email: "mfoster@test.com",
                age: NumberInt(27)
            },
            cart: []
        }
    }
)


db.getCollection('shoppingCard').update(
    { index: 1 },
    {
        $unset: {  //delete filed in document
            cartId: 1
        }
    }
)

// array update operator

db.getCollection('shoppingCard').update(
    { index: 1 },
    {
        $push: {
            // name: [2, 1] // store as a array inside array
            // name: 2 
            // name:{$each:[4,5]} // store as a element in array
        }
    }
)

db.getCollection('shoppingCard').update(
    { index: 1 },
    {
        $addToSet: {
            name: 4  // if inside array already exist then don't add again
        }
    }
)


db.getCollection('shoppingCard').update(
    { index: 1 },
    {
        $pop: {
            //  name:1 //delete last element
            name: -1 //delete first element
        }
    }
)

db.getCollection('shoppingCard').update(
    { index: 1 },
    {
        $pull: {
            // name: 2 // delete match record
            name: { $gt: 2 } // delete gt 2 match record
        }
    }
)

db.getCollection('shoppingCard').update(
    { index: 1 },
    {
        $pullAll: {
            name: [2] //delete all match record
        }
    }
)