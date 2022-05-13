import React, { useState, useEffect } from 'react';

// Made by Massimo De Luca.

function App() {
  const lazySelection = [
    "Where is Shopify located?",
    "What does Shopify sell?",
    "What is Shopify's core values?",
    "Do I have a good chance to work at Shopify?"
  ]
  const [text, setText] = useState(lazySelection[0]);
  const [lazy, setLazy] = useState(true);
  const [prompts, setPrompts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    lazy && setText(lazySelection[0]);
  }, [lazy]); 


  const handleSubmit = () => {
    const data = {
      prompt: text,
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
     };
     fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
        setPrompts([...prompts, {prompt: text, response: data.choices[0].text.replace("\n", "") }]);
      })
      .catch(() => setErrorMessage("An error has occurred, If you are a developer, Checkout the console for more details."));
  };

  return (
    <div className="min-h-screen items-center justify-center flex flex-col bg-neutral-800 text-2xl text-white">
      {errorMessage &&
        <p className="absolute top-0 bg-red-600 p-2 pt-1 rounded-b-lg">{errorMessage}</p>
      }
      
      <h1 className="text-5xl mt-16">Shopify Front End Developer Challenge</h1>
      <h3 className="text-3xl">Made by Massimo De Luca</h3>
        
      <div className="flex items-center mt-16"> 
        <p>Are you </p>
        <button className={"border-sky-600 rounded mx-2" + (lazy ? " border-b-4" : "")} onClick={() => setLazy(true)}>Lazy</button>
        <p>or</p>
        <button className={"border-sky-600 rounded ml-2" + (!lazy ? " border-b-4" : "")}  onClick={() => setLazy(false)}>Sophisticated</button>
        <p>?</p>
      </div>

      <div className="w-4/5">
        <p className="w-40 mb-1">GPT-3 Text:</p>
        {lazy ? 
          <select className="bg-neutral-800 border-b-4 border-sky-600 rounded w-full" onChange={e => setText(e.target.value)}>
            {lazySelection.map((text) => 
              <option key={text} value={text}>{text}</option>
            )}
          </select>
        :
          <textarea className="bg-neutral-800 border-2 border-sky-600 rounded-tl-md rounded-bl-md rounded-tr-md p-2 w-full" onChange={e => setText(e.target.value)} rows="6" value={text} placeholder="Submission Text" />
        }
        <button className="float-right bg-sky-600 rounded-bl-lg rounded-br-lg py-2 px-4" style={{marginTop:'-6px'}} onClick={handleSubmit}>Submit</button>
      </div>

      <div className="w-4/5">
        {prompts.map(({prompt,response}) => 
          <div key={prompt} className="bg-neutral-900 p-4 mt-6 rounded-lg text-xl">
            <div className="flex">
              <p className="text-2xl w-48">Prompt:</p>
              <p className="text-neutral-400 w-full">{prompt}</p>
            </div>
            <div className="flex border-t-2 mt-4 pt-4 border-neutral-700">
              <p className="text-2xl w-48">Response:</p>
              <p className="text-neutral-400 w-full">{response}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
