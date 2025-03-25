import React, { useState } from "react";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("prompt", prompt);
    if (file) {
      formData.append("template_file", file);
    }

    try {
      // Adjust the backend URL if necessary.
      const res = await axios.post("http://localhost:8000/generate/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data);
    } catch (error) {
      console.error("Error generating PPT:", error);
      setResponse({ error: "An error occurred while generating the PPT." });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">PPT Builder - Frontend Test</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-lg font-medium">
            PPT Prompt:
          </label>
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={handlePromptChange}
            className="mt-1 block w-full border rounded-md p-2"
            placeholder="Enter your prompt here..."
          />
        </div>
        <div className="mb-4">
          <label htmlFor="template_file" className="block text-lg font-medium">
            Upload Template (optional):
          </label>
          <input
            type="file"
            id="template_file"
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Generate PPT
        </button>
      </form>
      {response && (
        <div className="mt-4">
          <h2 className="text-xl">Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;