import { OPENAI_API_KEY } from "@/config";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import type { Document, DocumentInterface } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { Runnable, RunnableConfig, RunnableSequence } from "@langchain/core/runnables";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";
import { pull } from "langchain/hub";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatOllama } from "@langchain/ollama"
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers"
import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import z from "zod";

// Create Q&A chain with LangChain
let vectorStore: FaissStore | null = null;
let questionAnswerChain: RunnableSequence<Record<string, unknown>, string> | null = null;
let retrieval_qa_chat_prompt: ChatPromptTemplate | null = null;
let retriever: VectorStoreRetriever<FaissStore> | null = null;
let ragChain: Runnable<any, any> | null = null;
let extendedChain: Runnable<any, any, RunnableConfig<Record<string, any>>>

// BaseMessage[] to work with chat history
let chat_history: BaseMessage[] = [];

// History-based Retriever
let rephrase_prompt: ChatPromptTemplate | null = null;
let history_aware_retriever: Runnable<
  { input: string; chat_history: string | BaseMessage[] },
  DocumentInterface<Record<string, any>>[],
  RunnableConfig<Record<string, any>>
>;

// Init LLMs and Embeddings
const model = new ChatOllama({
   model: "llama3.1:8b",
   temperature: 0,
   baseUrl: "http://ollama:11434"
})
const embedder = new HuggingFaceTransformersEmbeddings({
  model: "Xenova/all-MiniLM-L6-v2",
});

const mytool: DynamicStructuredTool<any> = tool(({a}: {a: string}): string => {
    /**
     * End the conversation.
     *
     * @param a - user speech, indicating bye
     * @returns an signal string to the backend
     */
    console.log("Use tool")
    const goodbyePhrases = ['bye', 'byebye', 'goodbye', 'tạm biệt', 'hẹn gặp lại', 'end', 'exit', 'quit'];
        const isGoodbye = goodbyePhrases.some(phrase =>
          a.toLowerCase().includes(phrase)
        );
    return isGoodbye ? "End chat" : "Continue chat";
  }, {
    name: "finish_conversation",
    description: "End the current conversation only if the user speech clearly indicating a goodbye purpose",
    schema: z.object({
      a: z.string(),
    }),
  })

async function response_from_LLM(index_path: string, user_msg: string): Promise<Error | {
  response: string;
  message: string; }> {
  if (!retrieval_qa_chat_prompt) {
    // I fork "langchain-ai/retrievala-qa-chat" on smith.langchain.com/hub then customize it
    retrieval_qa_chat_prompt = await pull<ChatPromptTemplate>("davidnguyen2212/retrievala-qa-chat-for-chatbot");
  }

  if (!rephrase_prompt) {
    rephrase_prompt = await pull<ChatPromptTemplate>("langchain-ai/chat-langchain-rephrase");
  }

  if (!questionAnswerChain) {
    questionAnswerChain = await createStuffDocumentsChain({
      llm: model,
      prompt: retrieval_qa_chat_prompt,
    });
  }

  if (!vectorStore) {
    try {
      const tools = [mytool];
      vectorStore = await FaissStore.load(index_path, embedder);
      retriever = vectorStore.asRetriever();
      history_aware_retriever = await createHistoryAwareRetriever({
        llm: model.bindTools(tools),
        retriever: retriever,
        rephrasePrompt: rephrase_prompt,
      });

      ragChain = await createRetrievalChain({
        retriever: history_aware_retriever,
        combineDocsChain: questionAnswerChain,
      });

      extendedChain = ragChain?.pipe(async (input) => {
        const endChatResponse = await tools[0].invoke({a: input.input});
        if (endChatResponse !== "")
          return { ...input, endChat: endChatResponse };
      });
    } catch (error) {
      console.error("Error loading vector store:", error);
      return;
    }
  }

  const results: { context: Document[]; answer: string } & { [key: string]: unknown } = await extendedChain.invoke({
     input: user_msg, chat_history: chat_history
  });

  if (results) {
    // Thêm thông điệp trả lời vào lịch sử trò chuyện
    chat_history.push(new HumanMessage(user_msg))
    chat_history.push(new AIMessage(results.answer))

    return {
      response: results.answer,
      message: results.endChat as string || "Successfully"
    }
  }

  return Error("Asking failed")
}

export { response_from_LLM };
