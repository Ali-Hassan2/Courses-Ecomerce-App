import ChatBot from "../Components/chatbot";
import Navbar from "../Components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div>
        <Navbar/>
        {children}
        <ChatBot />
      
    </div>
  );
};

export default MainLayout
