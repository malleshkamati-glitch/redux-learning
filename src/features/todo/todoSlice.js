import { createSlice,nanoid } from "@reduxjs/toolkit";

const initialState={
    todos:[{id:1,text:"Hello world"}]
}

export const todoSlice=createSlice({
    name:'todo',
    initialState,
    reducers:{
        addTodo:(state,action)=>{
            const todo={id:nanoid(),text:action.payload.text};

            state.todos.push(todo);

        },
        removeTodo:(state,action)=>{
            const todo=state.todos.filter((a)=>a.id!==action.payload.id);
            state.todos=todo;
        },
    }

})

export const{addTodo,removeTodo}=todoSlice.actions

export default todoSlice.reducer