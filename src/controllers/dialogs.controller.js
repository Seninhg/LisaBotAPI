import connectToDatabase from "../scripts/mongodb.js";

export const getDialogs = (async (req, res)=>{
    try{
        const chatbotDb = await connectToDatabase();

        const lisaCollection = chatbotDb.collection("lisaBot");
        const usersDialogs = await (lisaCollection.find({})).toArray();
        res.json({status: "succes", data: usersDialogs});
    }catch(err){
        res.json({status: "fail", data: err});
    }
    
})

export const getDialog = (async (req, res)=>{

    const {idUser} = req.params;

    try{
        const chatbotDb = await connectToDatabase();

        const lisaCollection = chatbotDb.collection("lisaBot");
        
        const result = await (lisaCollection.findOne({idUser}))
        result == null?res.send({status: "fail", msg: "no se encuentra registrado dicho usuario"}):res.send({status: "succes", data: result});
    }catch(err){
        res.json({status: "fail", data: err});
    }
})