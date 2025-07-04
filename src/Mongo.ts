import mongoose from "mongoose";
import { WallpaperCategoryData, WallpaperData } from "./DataType";
import { Wallpaper, WallpaperCategory } from "./Model.js";
import { submitReport } from './FileHandling.js';
export default class MongoAPI {

    async connectMongoose(url: string) {
        let isConnected = false;
        try {
            await mongoose.connect(url);
            isConnected = true;
            console.log('Connected to MongoDB');
        } catch (error:any) {
            console.error('Error connecting to MongoDB:', error);
            // Log specific error for deployment issues
            if (error.name === 'MongooseServerSelectionError') {
                console.error('IP Address not whitelisted in MongoDB Atlas');
            }
        }
        return isConnected;
    }




    // -------------------- requests ----------------------
    async addWallpapers(wallpapers: Array<WallpaperData>) {
        try {
            const bulkOps = wallpapers.map((wallpaper) => ({
                updateOne: {
                    filter: { _id: wallpaper._id },
                    update: { $set: wallpaper },
                    upsert: true,
                },
            }));

            const result = await Wallpaper.bulkWrite(bulkOps);

            console.log("Wallpapers added to MongoDB:", result);
            return true;
        } catch (error: any) {

            await submitReport(error.message + "\nby addWallpapers()")
            return false;
        }
    }

    async createCollection(data: WallpaperCategoryData) {

        try {
            const update = data;
            const options = {
                upsert: true
            };

            const result = await WallpaperCategory.findOneAndUpdate({ _id: data._id }, update, options);
            console.log("Document added to MongoDB:", result);

            return true;
        } catch (error: any) {

            await submitReport(error.message + "\nby createCollection()")
            return false;
        }
    }






    /* **************************** Public Request ********************************* */

    async getCollections() {

        try {
            return await WallpaperCategory.find().select('-__v') as Array<WallpaperCategoryData>;
        } catch (error: any) {

            await submitReport(error.message + "\nby getCollection()")
            return null;
        }
    }

    async findWallpaper(id: string) {

        try {
            return await Wallpaper.findById(id) as WallpaperData | null;
        } catch (error: any) {

            await submitReport(error.message + "\nby findWallpaper()")
            return null;
        }
    }

    async getAllWallpapers(page: number) {
        try {
            const pageSize = 30;                    // Number of documents per page
            const skip = (page - 1) * pageSize;     // Calculate the number of documents to skip

            return await Wallpaper.find()
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(pageSize)
                .select('-__v') as Array<WallpaperData>;

        } catch (error: any) {

            await submitReport(error.message + "\nby getAllWallpapers()")
            return null;
        }
    }
    async getWallpapers(categoryId: string, page: number) {
        try {
            const pageSize = 30;                    // Number of documents per page
            const skip = (page - 1) * pageSize;     // Calculate the number of documents to skip

            return await Wallpaper.find({ category_id: categoryId })
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(pageSize)
                .select('-__v') as Array<WallpaperData>;

        } catch (error: any) {

            await submitReport(error.message + "\nby getWallpapers()")
            return null;
        }
    }


    async searchWallpapers(query: string, page: number) {

        try {
            // code to search
            const pageSize = 30
            const skipCount = (page - 1) * pageSize;

            return await Wallpaper.find(
                { $text: { $search: query } }
            ).sort({ score: { $meta: 'textScore' } })
            .select('-__v')
            .skip(skipCount)
            .limit(pageSize) as Array<WallpaperData>;

        } catch (error: any) {

            await submitReport(error.message + "\nby findWallpaper()")
            return null;
        }
    }



    // ------------------ Account -------------------

    // async isAdmin(accountId: string) {
    //     try {
    //         const account = await Account.findById(accountId)
    //         if (account == null) return false
    //         if (account.role == 'CEO' || account.role == 'CO') return true

    //     } catch (error) {
    //         console.log(error)
    //     }

    //     return false
    // }

    // async isAccountExist(accountId: string) {
    //     try {
    //         const account = await Account.findById(accountId)
    //         if (account != null) return true

    //     } catch (error) {
    //         console.log(error)
    //     }

    //     return false
    // }

    // async getAccount(email: string) {
    //     try {
    //         const account = await Account.findOne({ email: email });
    //         console.log("fetch account")
    //         return account;

    //     } catch (error) {
    //         console.error('Error in account:', error);
    //         return null
    //     }
    // }

    // async createAccount(accountData: AccountData) {
    //     try {
    //         const account = await Account.create(accountData)
    //         console.log("create account")
    //         return account

    //     } catch (error) {
    //         console.error('Error in account:', error);
    //         return null
    //     }
    // }

    // async resetAccountPassword(accountId: string, newPassword: string) {
    //     try {
    //         const account = await Account.findByIdAndUpdate(accountId, { password: newPassword })
    //         console.log("reset account password")
    //         return account

    //     } catch (error) {
    //         console.error('Error in account:', error);
    //         return null
    //     }
    // }





}
