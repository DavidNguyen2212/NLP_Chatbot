// import { EmblaOptionsType } from 'embla-carousel'
// import './App.css'
// import './css/embla.css'
// import './css/sandbox.css'
// import EmblaCarousel from './components/EmblaCarousel'
// import Footer from './components/Footer'
// import Header from './components/Header'
// import Searchbar from './components/Searchbar'
// import { ChatBotProvider } from 'react-chatbotify'
// import MyChatBot from './components/Chatbot'
// import { ConversationProvider } from './contexts/CurrentChat'

// const OPTIONS: EmblaOptionsType = { loop: true, duration: 30 }
// const SLIDE_COUNT = 7


// function App() {

//   return (
//     <div className='w-full'>
//     <Header />
//     <EmblaCarousel slide_count={SLIDE_COUNT} options={OPTIONS} />
//     <ConversationProvider>
//       <ChatBotProvider>
//         <Searchbar />
//         <MyChatBot />
//       </ChatBotProvider>
//     </ConversationProvider>
//     <Footer />
//   </div>
//   )
// }

// export default App

import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Homepage from './pages/Homepage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} /> {/* Trang danh sách các cuộc trò chuyện */}
        <Route path="/chat/:id" element={<Homepage />}/> {/* Trang chi tiết dựa trên id */}
      </Routes>
    </Router>
  );
};

export default App;
