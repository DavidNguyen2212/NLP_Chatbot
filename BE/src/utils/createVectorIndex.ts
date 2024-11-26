import { FaissStore } from "@langchain/community/vectorstores/faiss"
import type { Document } from "@langchain/core/documents"
import "pdf-parse"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import path from 'path';
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers"


async function createIndexFromPdf(file_path: string): Promise<void> {
  try {
    // Tải PDF
    const loader = new PDFLoader(file_path);
    const docs: Document[] = await loader.load();

    // Tách tài liệu thành các đoạn văn nhỏ
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 50,
    });
    const splits = await textSplitter.splitDocuments(docs);

    const embeddings = new HuggingFaceTransformersEmbeddings({
      model: "Xenova/all-MiniLM-L6-v2",
    });
    const vectorStore = await FaissStore.fromDocuments(splits, embeddings);

    // Lưu chỉ mục vào thư mục local
    const save_dir = path.resolve(__dirname, '../hf_indexes');

    console.log(`Saving index to: ${save_dir}`);

    await vectorStore.save(save_dir);
    console.log("Index saved successfully.");
  } catch (error) {
    console.error("Error creating index from PDF:", error);
  }
}

export {createIndexFromPdf};
