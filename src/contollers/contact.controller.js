import { Contact } from "../models/contact.model.js";
import ejs from 'ejs';
import { error_res, success_res, uploadImage } from "../config/general.js";



export const postContactList = async (req, res) => {
    
    try {
        
        const user = req.session.user;
        const body = req.body;
        console.log("req.body------------------->", req.body);
        
        const filterData = req.body.filterData;
        
        const query = { userId: user._id }
        
        if(filterData.filterName){
            query.name = filterData.filterName;
        }
        if(filterData.filterEmail){
            query.email = filterData.filterEmail;
        }
        if(filterData.filterMobileNumber){
            query.MobileNumber = Number(filterData.filterMobileNumber);
            
        }
        if(filterData.filterDate){
            const startDate = new Date(`${filterData.filterDate}T00:00:00Z`);
            const endDate = new Date(`${filterData.filterDate}T23:59:59Z`)
            query.createdAt = {
                $gte: startDate,
                $lt: endDate,
            }
        }        
        
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        
        const skip = (page - 1) * limit;
        
        const total = await Contact.countDocuments(query);
        
        const data = await Contact.find(query).populate('groupId').sort({ createdAt: -1 }).skip(skip).limit(limit);
        
        const pagination = {
            totalData: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit) || 1,
            limit: limit,
        };
        
        // const data = await Contact.aggregate([
            //     {
                //         $lookup: {
                    //             from: "groups", 
                    //             localField: "groupId",
                    //             foreignField: "_id", 
                    //             as: "groupDetails" 
                    //         }
                    //     }
                    // ]);      
                    
                    
                    const fileToBeRender = await ejs.renderFile("/Node/Practice/src/views/contactsTable.ejs", {
            body: {
                data: data,
            }
        })
        
        return res.json(success_res("", {fileToBeRender, pagination}));
        
    } catch (error) {
        console.log(error);
        throw error;
    }
    
}


export const addContact =  async (req, res) => {
    try {
        const userId = req.userId;
        const {groupId, name, email, mobile} = req.body;
        const image = req.files;
        const user = req.session.user;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(!name){
            return res.json(error_res("name is required!"));
        }
        if(name.length < 3){
            return res.json(error_res("Name length should be 3 or greater than 3!"));
        }
        if(!email){
            return res.json(error_res("email is required!"));
        }
        if(!(emailPattern.test(email))){
            return res.json(error_res("Please enter valid email"));
        }
        if(!image){
            return res.json(error_res("image is required!"));
        }
        if(!mobile){
            return res.json(error_res("mobile number is required!"));
        }
        if(mobile.length !== 10){
            return res.json(error_res("Please enter your 10 digit mobile number"));
        }
        if(!groupId){
            return res.json(error_res("Please select group!"));
        }

        const findContact = await Contact.findOne({
            $and: [
                {userId: user._id },
                {MobileNumber: mobile},
            ]
        });

        if(findContact == null){
            
            const uploadedImage = await uploadImage(image);
            
            const data = await Contact.create({
                userId: userId,
                name: name,
                email: email,
                image: uploadedImage,
                MobileNumber: mobile,
                groupId: groupId,
            });

            const data1 = await Contact.findOne({MobileNumber: mobile}).populate('groupId');

            return res.json(success_res("Contact Created Successfully", data1));
        }
        
        return res.json(error_res("Contact already exist"));
            
    } catch (error) {
        console.log(error);
        throw error;
    }

}


export const editContact = async (req, res) => {
    try {
        
        const { contactId, name, email, mobile, groupId } = req.body;
        const image = req.files;
        const user = req.session.user;

        console.log("Req.Body-------------------------->", req.body);

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(!name){
            return res.json(error_res("name is required!"));
        }
        if(name.length < 3){
            return res.json(error_res("Name length should be 3 or greater than 3!"));
        }
        if(!email){
            return res.json(error_res("email is required!"));
        }
        if(!(emailPattern.test(email))){
            return res.json(error_res("Please enter valid email"));
        }
        if(!mobile){
            return res.json(error_res("mobile number is required!"));
        }
        if(mobile.length !== 10){
            return res.json(error_res("Please enter your 10 digit mobile number"));
        }
        if(!groupId){
            return res.json(error_res("Please select group!"));
        }

        let updateImage = null;

        if(image){
            updateImage = await uploadImage(image);
        }

        const findSelectedContact = await Contact.findOne({ _id: contactId});

        if(!findSelectedContact){
            return res.json(error_res("Contact not found"));
        }
        if(findSelectedContact.MobileNumber != mobile){

            const validateMobile = await Contact.findOne({ userId: user._id, MobileNumber : mobile });

            if(validateMobile){
                return res.json(error_res("Please enter unique value of mobile number!"));
            }

        }

        const updateObj = { 
            name: name, 
            email: email, 
            image: updateImage ? updateImage : findSelectedContact.image,
            MobileNumber: mobile,
            groupId: groupId,
        };        

        const updateContact = await Contact.findOneAndUpdate(
                    { _id: contactId },
                    updateObj,
                    { new: true }
                ).populate('groupId');
            
        return res.json(success_res("Contact has been updated!", updateContact));
                
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export const deleteContact = async (req, res) => {

    try {
        
        const user = req.session.user;
        const contactId = req.body.contactId;


        const deleteContact = await Contact.findOne({_id: contactId});

        if(!deleteContact){
            return res.json(error_res("Contact not found!"));
        }

        await Contact.findOneAndDelete({ _id: contactId});

        const total = await Contact.countDocuments({ userId: user._id });

        return res.json(success_res("Contact Deleted Successfully", total));

    } catch (error) {
        console.log(error);
        throw error;
    }
    
}
