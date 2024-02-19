import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import OrderModel from "./order.model.js"

export default class OrderRepository {
    constructor() {
        this.collection = "orders";
    }

    async placeOrder(userId) {
        const client = getClient();
        const session = client.startSession();
       
        try {
            //1.Get cartItem and calculate total Amount
            const db = getDB();
            session.startTransaction();
            const items = await this.getTotalAmount(userId, session);
            const finalTotalAmount = items.reduce((acc, item) => acc + item.totalAmount, 0);
            console.log(finalTotalAmount);

            //2.create an order record
            const newOrder = new OrderModel(new ObjectId(userId), finalTotalAmount, new Date());
            await db.collection(this.collection).insertOne(newOrder, { session });

            //3.Reduce the record
            for (let item of items) {
                await db.collection("products").updateOne(
                    { _id: item.productID },
                    { $inc: { stock: -item.quantity } },
                    { session }
                )
            }
            throw new Error("Something is wrong in placeOrder");
            //4.clear the cart items
            await db.collection.updateMany("cartItems").deleteMany({
                userID: new ObjectId(userId)
            }, { session });
            session.commitTransaction();
            session.endSession();
            return;
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            console.log(err);
            // throw new ApplicationError("Something went wrong with data base");
        }
    }
    async getTotalAmount(userId,session) {
        const db = getDB();
        const items = await db.collection("cartItems").aggregate([
            //1.get cartItems for user
            {
                $match: {
                    userID: new ObjectId(userId)
                }
            },
            //2.get products form product collection
            {
                $lookup: {
                    from: "products",
                    localField: "productID",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            //3.unwind the productInfo
            {
                $unwind: "$productInfo"
            },
            //4.Calculate totalAmount for each cartItems.
            {
                $addFields: {
                    "totalAmount": {
                        $multiply: ["$productInfo.price", "$quantity"]
                    }
                }
            }
        ], { session }).toArray();
        return items;
    }
}