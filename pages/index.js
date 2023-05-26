import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import Spinner from 'react-bootstrap/Spinner';
import Image from 'next/image';
import { useRef } from "react";
import { useEffect } from "react";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  const [resultImg, setResultImg] = useState();

  const loadRef = useRef(null);

  useEffect(() => {
    setResultImg("/airplane.png");
    //console.log(loadRef);
  },[]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setResultImg(data.resultImg);
      setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  
  return (
    <div>
      <Head>
        <title>AI GUIDE</title>
        <link rel="icon" href="/airplane.png" />
      </Head>

      <main className={styles.main}>
        <img src="/airplane.png" className={styles.icon} />
        <h3>AI GUIDE</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter a place"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Start Guide" />
        </form>

        <div>
          <Image
            src={resultImg}
            width={300}
            height={300}
            alt={animalInput}
            
            className={styles.resultImg}
            onLoadingComplete={() => loadRef.current.remove()}
          />
          <div className={styles.result}>{result}</div>
          <Spinner animation="border" ref={loadRef}/>
          
        </div> 
      </main>
    </div>
  );
}
