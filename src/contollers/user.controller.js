import { error_res, success_res, uploadImage } from "../config/general.js";
import { Contact } from "../models/contact.model.js";
import Toastify from 'toastify-js';
import ejs from "ejs"
import { Group } from "../models/group.model.js";


export const getDashboard = async (req,res) => {
    try{
        
        const user = req.session.user;

        const groupCount = await Group.find({userId: user._id}).countDocuments();
        const contactCount = await Contact.find({userId: user._id}).countDocuments();
        
        res.render('dashboard',{
            header: {
                title: `Welcome, ${req.name}`,
                groupCount: groupCount,
                contactCount: contactCount,
            }
        });
    }
    catch(err){
        console.log(err);
        throw err;
    }
}


export const getGroups = async (req, res) => {
    try {

        res.render('groups',{ 
            header: {
                title: `Welcome, ${req.name}`,
            }
         })
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export const getContacts = async (req, res) => {
    try {

        const user = req.session.user;

        const userGroups = await Group.find({userId: user._id});
        
        res.render('contacts',{ 
            header: {
                title: `Welcome, ${req.name}`,
                userId: req.name,
                userGroups: userGroups,
            }
         })
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

        if(!name){
            return res.json(error_res("Please enter name!"));
        }
        if(!email){
            return res.json(error_res("Please enter email!"));
        }
        if(!image){
            return res.json(error_res("Please select image!"));
        }
        if(!mobile){
            return res.json(error_res("Please enter mobile number"));
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


export const addGroup = async (req, res) => {
    
    try {
        
        const user = req.session.user
        
        const groupName = req.body.groupName;
        
        const findGroup = await Group.find({ 
            $and: [
                { userId: user._id },
                { groupName: groupName },
            ]}
        );        

        if(findGroup.length !== 0){
            return res.json(error_res("Group already exist!"));
        }

        const data = await Group.create({
            groupName: groupName,
            userId: user._id,
        });

        return res.json(success_res("Group Created Successfully", data))

    } catch (error) {
        console.log(error);
        throw error;
    }

}


export const postContactList = async (req, res) => {

    try {
        
        const user = req.session.user;
        
        const data = await Contact.find({ userId: user._id }).populate('groupId');
        

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
        
        return res.json(success_res("", fileToBeRender));

    } catch (error) {
        console.log(error);
        throw error;
    }

}


export const postGroupList = async (req, res) => {
    
    try {

        const user = req.session.user;

        const data = await Group.find({userId: user._id});
        
        const fileToBeRender = await ejs.renderFile("/Node/Practice/src/views/groupList.ejs", {
            body : {
                data: data,
            }
        })
        
        return res.json(success_res("data get successfully", fileToBeRender))

    } catch (error) {
        
    }

}


export const editContact = async (req, res) => {
    try {
        
        const formData = req.body;
        
        const image = req.files;
        
        const findContactId = await Contact.findOne({_id: formData.contactId});

        if(!findContactId){
            return res.json(error_res("Contact not found!"));
        }

        let updateImage = null;

        if(image){
            updateImage = await uploadImage(image)
        }

        let updateObj = {
            name: formData.name ? formData.name : findContactId.name,
            email: formData.email ? formData.email : findContactId.email,
            image: updateImage ? updateImage : findContactId.image,
            MobileNumber: formData.mobile ? formData.mobile : findContactId.MobileNumber,
            groupId: formData.editContactGroup ? formData.editContactGroup : findContactId.groupId,
        }

        const updateContact = await Contact.findOneAndUpdate({_id: findContactId._id}, updateObj, { new : true } ).populate('groupId');

        return res.json(success_res("Contact has been updated!", updateContact));


    } catch (error) {
        console.log(error);
        throw error;
    }
}


export const editGroup = async (req, res) => {
    
    try {
        
        const formData = req.body;
        const user = req.session.user;

        const validateGroup = await Group.find({
            
            $and: [
                { userId: user._id },
                { groupName: formData.groupName }
            ]
           
        });        
        
        if(validateGroup.length !== 0){
            return res.json(error_res("Group is already exist!"));
        }

        const updateGroup = await Group.findOneAndUpdate( { $and: [ { userId: user._id }, { _id: formData.groupId }] }, { groupName: formData.groupName }, { new: true } );
        
        return res.json(success_res("Group has been updated!", updateGroup));

    } catch (error) {
        console.log(error);
        throw error;
    }

}


export const deleteContact = async (req, res) => {

    try {
        

        const deleteContact = await Contact.findOne({_id: req.body.contactId});

        if(!deleteContact){
            return res.json(error_res("Contact not found!"));
        }

        await Contact.findOneAndDelete({ _id: req.body.contactId});

        return res.json(success_res("Contact Deleted Successfully"));

    } catch (error) {
        console.log(error);
        throw error;
    }
    
}


export const deleteGroup = async (req, res) => {
    
    try {
        
        const groupId = req.body.groupId;

        const validateGroup = await Group.findOne({_id: groupId});

        if(!validateGroup){
            return res.json(error_res("Group not found!"));
        }

        const validateGroupIsSelectedOrNot = await Contact.findOne({groupId: groupId});

        if(validateGroupIsSelectedOrNot){
            return res.json(error_res("You can't delete a group, group is already selected by contact"))
        }

        await Group.findOneAndDelete({_id : groupId});

        return res.json(success_res("Group deleted successfully"));
        

    } catch (error) {
        
        console.log(error);
        throw error;

    }

}