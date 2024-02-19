import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";

const LikeModel = new mongoose.model("Like", likeSchema);
     export class LikeRepository {

    async getLikes(id,type) {
        return await LikeModel.find({
            likeable: id,
            on_model: type
        }).populate('user').populate({ path: 'likeable', model: type });
    }

    async likeProduct(userId, productId) {

        try {
            const newLike = new LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(productId),
                on_model: 'Product'
            })
            await newLike.save();
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }

    }

    async likeCategory(userId, categoryId) {
        try {
            const newLike = new LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(categoryId),
                on_model: 'Category'
            })
            await newLike.save();
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }
}