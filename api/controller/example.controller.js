const securedExample = async (req,res) => {
 console.log("Something that needs authentication ran here");
 return res.status(200).json({message: "This is a secured example process"});
};



export default {securedExample};