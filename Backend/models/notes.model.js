import mongoose from "mongoose";

const NotesSchema  = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    pinned: {
      type: Boolean,
      default:false
    },
    color:{
        type:String,
        default:'yellow'
    },
    tags:[]
  },
  { timestamps: true}
);

const notes =  new mongoose.model("Note", NotesSchema);
export default notes;
