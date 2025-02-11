import { Group } from "../models/group.model.js";
import { Contact } from "../models/contact.model.js"
import ejs from 'ejs';
import { error_res, success_res } from "../config/general.js";
import path from 'path';
const __dirname = path.resolve();

export const postGroupList = async (req, res) => {
    
    try {

        const user = req.session.user;
        const body = req.body;

        let { filterGroupName, filterDate } = req.body.filterData;        

        filterGroupName = filterGroupName.trim().replace(/\s{2,}/g,' ');
        const query = { userId: user._id };
        
        if(filterGroupName){
            query.groupName = { $regex: filterGroupName, $options: 'i' };
        }
        if(filterDate){
            const startDate = new Date(`${filterDate}T00:00:00Z`);
            const endDate = new Date(`${filterDate}T23:59:59Z`)
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
        
        const fileToBeRender = await ejs.renderFile( __dirname + "/src/views/groupList.ejs", {
            body : {
                data: data,
                pagination: pagination,
            }
        })
        
        return res.json(success_res("data get successfully", {fileToBeRender, pagination}))

    } catch (error) {
        return res.json(error_res(error));
    }

}


export const addGroup = async (req, res) => {
    
    try {
        
        const user = req.session.user;

        let groupName = req.body.groupName;
        
        const groupNamePattern = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
        groupName = groupName.trim().replace(/\s{2,}/g, " ").substring(0,30);
        // name input: '       Shubham    Chuahan     '
        // name output: 'Shubham Chuahan'

        if(!groupName){
            return res.json(error_res("Group name is required!"));
        }
        if(groupName.length < 3){
            return res.json(error_res("GroupName length should be 3 or greater than 3"));
        }
        if(!(groupNamePattern.test(groupName))){
            return res.json(error_res("Please enter valid name"));
        }
        
        const findGroup = await Group.find({ userId: user._id , groupName: groupName });

        if(findGroup.length !== 0){
            return res.json(error_res("Group already exist!"));
        }

        const data = await Group.create({
            groupName: groupName,
            userId: user._id,
        });

        return res.json(success_res("Group Created Successfully", data))

    } catch (error) {
        return res.json(error_res(error));
    }

}


export const editGroup = async (req, res) => {
    
    try {
        
        let { groupId, groupName } = req.body;
        const user = req.session.user;
        const groupNamePattern = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
        groupName = groupName.trim().replace(/\s{2,}/g, " ").substring(0,30);

        if(!groupName){
            return res.json(error_res("GroupName is required!"));
        }
        if(groupName.length < 3){
            return res.json(error_res("GroupName length should be 3 or greater than 3"));
        }
        if(!(groupNamePattern.test(groupName))){
            return res.json(error_res("Please enter valid name"));
        }
        // name input: '       Shubham    Chuahan     '
        // name output: 'Shubham Chuahan'

        const findGroup = await Group.findOne({ _id: groupId });

        if(!findGroup){
            return req.json(error_res("Group not found"));
        }
        if(findGroup.groupName != groupName){
            const validateGroup = await Group.findOne({ userId: user._id, groupName: groupName });

            if(validateGroup){
                return res.json(error_res("Please enter unique value of groupname"));
            }
        }

        const updateGroup = await Group.findOneAndUpdate( { userId: user._id ,  _id: groupId }, {groupName: groupName}, { new: true } );
        return res.json(success_res("Group has been updated!", updateGroup));

    } catch (error) {
        return res.json(error_res(error));
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
        const validateGroupIsSelectedByContact = await Contact.findOne({groupId: groupId});
        
        if(validateGroupIsSelectedByContact){
            return res.json(error_res("You can't delete a group, group is already selected by contact"))
        }
        
        await Group.findOneAndDelete({_id : groupId});

        const total = await Group.countDocuments({ userId: user._id });

        return res.json(success_res("Group deleted successfully", total));

    } catch (error) {
        
        return res.json(error_res(error));

    }

}