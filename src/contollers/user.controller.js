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

        const user = req.session;
        // console.log("session----------->", user);
        

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

        console.log("Query----------------->",query);
        
        
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;

        const skip = (page - 1) * limit;
        
        const total = await Contact.countDocuments(query);
        
        const data = await Contact.find(query).populate('groupId').sort({ createdAt: -1 }).skip(skip).limit(limit);
       console.log("Data--------->", data);
       
        
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


export const postGroupList = async (req, res) => {
    
    try {

        const user = req.session.user;
        const body = req.body;

        const filterData = req.body.filterData;
        console.log("req.body--------------->", req.body);

        const query = { userId: user._id }
        
        if(filterData.filterGroupName){
            query.groupName = filterData.filterGroupName;
        }
        if(filterData.filterDate){
            const startDate = new Date(`${filterData.filterDate}T00:00:00Z`);
            const endDate = new Date(`${filterData.filterDate}T23:59:59Z`)
            query.createdAt = {
                $gte: startDate,
                $lt: endDate,
            }
        }

        let page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;

        const skip = (page - 1) * limit;

        const total = await Group.countDocuments(query);
        const data = await Group.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const totalPages = Math.ceil(total / limit) || 1;
        if(page > totalPages){
            page = 1
        }

        const pagination = {
            totalData: total,
            currentPage: page,
            totalPages: totalPages,
            limit: limit,
        };
        
        const fileToBeRender = await ejs.renderFile("/Node/Practice/src/views/groupList.ejs", {
            body : {
                data: data,
                pagination: pagination,
            }
        })
        
        return res.json(success_res("data get successfully", {fileToBeRender, pagination}))

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


export const deleteGroup = async (req, res) => {
    
    try {
        
        const user = req.session.user;
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

        const total = await Group.countDocuments({ userId: user._id });

        return res.json(success_res("Group deleted successfully", total));
        

    } catch (error) {
        
        console.log(error);
        throw error;

    }

}