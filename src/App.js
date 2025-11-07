import React from "react";
import TaskForm from "./components/TaskForm";
import Header from "./components/Header";
import TaskResult from "./components/TaskResult";
import{BrowserRouter, Route, Routes} from "react-router-dom"
import AllTasks from "./components/AllTasks";
import Home from "./components/Home";

function App() {
  return (
    <div>
<BrowserRouter>
   <Header/>
      <Routes>
         <Route path="/" element={<Home/>}/>
        <Route path="/form" element={<TaskForm/>}/>
           <Route path="/result" element={<TaskResult/>}/>

    
      </Routes>
     
 
    
      </BrowserRouter>
    </div>
  );
}

export default App;
