const mongoose = require('mongoose');
const {Schema} = mongoose;
const categoryShema = new Schema({
    label:{type: String, required: true, unique: true},
    value:{type: String, required: true, unique: true}
})

const virtual = categoryShema.virtual('id');
virtual.get(
    function(){
        return this._id;
    }
)

categoryShema.set('toJSON',{
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret){
        delete ret._id
    }
})

exports.Category= mongoose.model('Category',categoryShema);