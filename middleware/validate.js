export  const validate = (schema)=>{
    return (req,res,next)=>{
        const {error , value} =schema.validate(req.body)
        if(error){
            const result =error.details.map(err => {
                return {
                    message:err.message,
                    field :err.path[0]
                }
            })
            
            return res.status(400).json(result)
        }
        next()
    }
}