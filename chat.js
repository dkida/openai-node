import { openai } from './openai.js';
import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const newMessage = async (history, message) => {
  const result = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [...history, message],
  })

  return result.choices[0].message;
}

const formatMessage = (userInput) => ({ role:'user', content: userInput });

const chat = () => {
  const history = [
    {
      role: 'system', 
      content: 'You are an AI assistant. Answer questions or else!',
    },
  ];

  const start = () => {
    rl.question('You: ', async (userInput) => {
      if (userInput.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      const message = formatMessage(userInput);
      const response = await newMessage(history, message);

      history.push(message, response);
      console.log(`AI: ${response.content}\n`)
      start();
    });
  };

  start();
}

console.log("Chatbot initialized. Type 'exit' to end the chat.")
chat();