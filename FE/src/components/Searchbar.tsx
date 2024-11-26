import React, { useState } from 'react';
import { useChatWindow, useMessages } from "react-chatbotify";
import axios from 'axios';
import { ApiResponse } from '../interfaces/Chatbot';


const Searchbar: React.FC = () => {
  try {
    const { toggleChatWindow, isChatWindowOpen } = useChatWindow();
    const { injectMessage } = useMessages()
    const [inputValue, setInputValue] = useState<string>("");
    const [disableInput, setDisableInput] = useState<boolean>(false)

    const fetchData = async (question: string) => {
      try {
        setDisableInput(true)
        const response = await axios.post<ApiResponse>(
          "http://localhost:3000/chat/6739e4cb25fff1ede535a008",
          { new_message: question }
        );
        await injectMessage(response.data.data, "bot"); 
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setDisableInput(false)
      }
    };

    const handleKeyPress = async (event?: React.KeyboardEvent<HTMLInputElement>) => {
      if (event && event.key === "Enter" && inputValue !== "") {  
        const user_question: string = inputValue
        console.log("From searchbar: ", inputValue)

        // Kiểm tra trạng thái của cửa sổ chat và toggle nếu cần
        if (!isChatWindowOpen) {
          toggleChatWindow();
        }
        setInputValue("")
        await injectMessage(user_question, "user")
        await fetchData(user_question)
      }
    };

    const handleButton = async (is_askany: boolean, is_lucky: boolean) => {
      const question: string = is_askany ? "What are OpenAI and their values?" : "I'm feeling lucky"
        // Kiểm tra trạng thái của cửa sổ chat và toggle nếu cần
      if (!isChatWindowOpen) {
        toggleChatWindow();
      }
      
      await injectMessage(question, "user")
      await fetchData(question)
    };

    const setInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value)
    }

    return (
      <div className="bg-[rgba(29,30,34,0.5)] w-1/2 flex flex-col justify-center items-center gap-12 p-8 rounded-xl absolute z-10 top-[25%] left-1/2 -translate-x-1/2">
        <div className="w-[250px] logo flex justify-center items-center relative z-20">
          <img
            alt="Google"
            src="https://seekvectorlogo.com/wp-content/uploads/2021/12/agoda-vector-logo-2021.png"
            className="w-full rounded-xl"
          />
        </div>
        <div className="bar mx-auto w-[90%] rounded-[30px] border-b-2 hover:shadow-lg focus-within:outline-none focus-within:shadow-lg relative z-10 bg-white flex flex-row justify-center items-center gap-2">
          <input
            className="searchbar h-[45px] bg-white border-none w-[80%] rounded-[30px] text-base outline-none"
            type="text"
            title="Search"
            value={inputValue}
            onChange={(e) => setInput(e)}
            onKeyDown={(e) => handleKeyPress(e)}
            placeholder="Hỏi bất kỳ thứ gì!?"
            disabled={disableInput}
          />
          <div className="flex justify-center items-center cursor-pointer top-[5px] left-[10px] w-5 h-5">
            <img
              className="voice h-5"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Google_mic.svg/716px-Google_mic.svg.png"
              title="Search by Voice"
            />
          </div>
        </div>
        <div className="buttons relative z-10 flex flex-row items-center justify-center gap-3">
          <button
            className="askany bg-[#f5f5f5] border-none text-[#707070] text-base py-[10px] px-[20px] m-1 rounded-[4px] outline-none hover:border-stone-500 focus:border-blue-500"
            type="button" onClick={() => handleButton(true, false)}
          >
            Ask any!
          </button>
          <button
            className="lucky bg-[#f5f5f5] border-none text-[#707070] text-base py-[10px] px-[20px] m-1 rounded-[4px] outline-none hover:border-stone-500 focus:border-blue-500"
            type="button" onClick={() => handleButton(false, true)}
          >
            I'm Feeling Lucky
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error: useChatWindow is not available.", error);
    return null;
  }
};

export default Searchbar;
