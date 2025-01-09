import { Contact } from "../models/contact.model.js";
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
