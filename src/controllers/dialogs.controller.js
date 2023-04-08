import connectToDatabase from "../scripts/mongodb.js";

export const getDialogs = (async (req, res)=>{
    try{
        const chatbotDb = await connectToDatabase();

        const lisaCollection = chatbotDb.collection("lisaBot");
        const usersDialogs = await (lisaCollection.find({})).toArray();
        res.json({status: "success", data: usersDialogs});
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
        result == null?res.send({status: "fail", msg: "dicho usuario no se encuentra registrado"}):res.send({status: "succes", data: result});
    }catch(err){
        res.json({status: "fail", data: err});
    }
})

export const deleteDialogs = (async(req, res)=>{
    const {idUser} = req.params;
    try{
        //accedemos al db
        const chatbotDb = await connectToDatabase();
        //accedemos a la colección de diálogos
        const lisaCollection = chatbotDb.collection("lisaBot");
        //se vacía el array de diálogos del usuario
        const result = await lisaCollection.updateOne({idUser}, {
            $set: {dialogs: []}
        })
        if(result.matchedCount == 1){
            if(result.modifiedCount == 1){
                res.send({status: "success", msg: "Diálogos eliminados con éxito"});
            }
            res.send({status: "success", msg: "Tus diálogos ya están eliminados capo"})
        }else{
            res.send({status: "fail", msg: "Usuario no encontrado"})
        }
        
    }catch(err){
        res.json({status: "fail", data: err});
    }
})