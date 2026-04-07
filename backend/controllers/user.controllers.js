import User from "../models/user.models.js";
import uploadOnCloudinary  from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";

    

export const getCurrentUser = async (req, res) => {
    try{
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getCurrentUser controller:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body;

        let assistantImage;

        if (req.file) {
            assistantImage = await uploadOnCloudinary(req.file.path);
        } else {
            assistantImage = imageUrl;
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                assistantName,
                assistantImage
            },
            { new: true }
        ).select("-password");

        res.status(200).json(user);

    } catch (error) {
        console.log("Error in updateAssistant controller:", error);
        return res.status(400).json({ message: "Error updating assistant" });
    }
};

export const askToAssistant = async (req, res) => {
    try{
        const { command } = req.body;
        const user = await User.findById(req.userId).select("-password");
        user.history.push(command);
        await user.save();
        const userName = user.name;
        const assistantName = user.assistantName;

        const response = await geminiResponse(command, assistantName, userName);

        const jsonMatch = response.match(/{[\s\S]*}/);
        if(!jsonMatch){
            return res.status(400).json({message: "Sorry, I couldn't understand the response from the assistant."});
        }
        const gemResult = JSON.parse(jsonMatch[0]);
        const type = gemResult.type;

        switch(type){
            case 'get-date':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response: `current date is ${moment().format("DD MMMM YYYY")}`
                });
            case 'get-time':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response: `current time is ${moment().format("hh:mm A")}`
                });
            case 'get-day':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response: `today is ${moment().format("dddd")}`
                });
            case 'get-month':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response: `current month is ${moment().format("MMMM")}`
                });
            case 'get-year':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response: `current year is ${moment().format("YYYY")}`
                });
            case 'calculator-open':
            case 'google-search':
            case 'general':
            case 'instagram-open':
            case 'youtube-open':
            case 'wikipedia-search':
            case 'youtube-search':
            case 'email-open':
            case 'maps-open':
            case 'weather-report':
            case 'news-report':
            case 'youtube-play':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response: gemResult.response
                })
            default:
                return res.status(400).json({ response : "Sorry, I couldn't understand the command."});
        }

    } catch (error) {
        console.log("Error in askToAssistant controller:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}