
function ItemModelMock(){

    this.create = async(params) => {
        return new Promise((resolve, reject) => {
            console.log("creating new item", JSON.stringify(params))

            setTimeout(() =>{
                resolve( {code: "success", message: "item created"} )
            , 50 })
        })
    }

    this.read = async(id) => {
        return new Promise((resolve, reject) => {

            console.log("model: reading item", id)

            setTimeout(() =>{
                id === 'null'
                ? reject(  {code: "error", message: "item not found" } )
                : resolve( {code: "success", item:{ id: id, name: "item name" } } )
            , 50 })
        })
    }    

    this.update = async(id, params) => {
        return new Promise((resolve, reject) => {
            console.log("updating exiting item", id, JSON.stringify(params))

            setTimeout(() =>{
                id === 'null'
                    ? reject(  {code: "error", message: "item not found" } )                
                    : resolve( {code: "success", message: `item with id: ${id} updated`} )
            , 50 })
        })

        
    }  
    
    this.delete = async( id ) => {
        return new Promise((resolve, reject) => {
            console.log("deleting item", id)

            setTimeout(() =>{
                id === 'null'
                    ? reject(  {code: "error", message: "item not found" } )                
                    : resolve( {code: "success", message: `item with id: ${id} deleted`} )
            , 50 })
        })

        
    }

    this.list = async(  ) => {
        return new Promise((resolve, reject) => {
            console.log("list items")

            setTimeout(() =>{
                resolve( {code: "success", items:[{ id: "id1", name: "item name" }, { id: "id2", name: "item name" }] })
            , 50 })
        })
    }    

}

module.exports = ItemModelMock