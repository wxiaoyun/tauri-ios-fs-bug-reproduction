import { invoke } from "@tauri-apps/api/core";
import { save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { createSignal } from "solid-js";
import "./App.css";
import logo from "./assets/logo.svg";

function App() {
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name: name() }));
  }

  async function handleDownload() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomString = Array.from(
      { length: 10000 },
      () => characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');

    try {
      // Open file dialog for save location
      const savePath = await save({
        title: "Select Save Location"
      });

      if (savePath) {
        console.log("SAVE PATH", savePath);

        // Save the random string to a file
        await writeTextFile(
          savePath,
          randomString,
        );

        const fileContent = await readTextFile(savePath);
        console.log("FILE CONTENT LENGTH", fileContent.length);
      }
    } catch (error) {
      console.error("Error saving file:", error);
    }
  }

  return (
    <main class="container">
      <h1>Welcome to Tauri + Solid</h1>

      <div class="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={logo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and Solid logos to learn more.</p>

      <form
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg()}</p>
      
      <button onClick={handleDownload}>
        Generate and Download Random String
      </button>
    </main>
  );
}

export default App;
