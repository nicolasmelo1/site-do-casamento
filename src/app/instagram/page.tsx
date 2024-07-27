/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState } from "react";

export default function Instagram() {
  const [stories, setStories] = useState<string[]>([]);
  const [shownStory, setShownStory] = useState<string | null | undefined>(undefined);
  
  function recursivelyGetStories(args: {
    abort?: AbortController
    timeout?: NodeJS.Timeout,
    isFirst?: boolean
  } = {}) {
    const isFirst = args.isFirst !== false
    const abortController = new AbortController();
    if (args.abort) args.abort.abort();
    if (args.timeout) clearTimeout(args.timeout); 

    const signal = abortController.signal;

    const timeout = setTimeout(() => {
      fetch("/api/stories/read", {
        cache: 'no-store',
        method: "GET",
        signal
      }).then((res) => res.json())
      .then((data) => {
        const newStories = [...stories, data?.storyUri];
        setShownStory(newStories[0]);
        setStories(() => newStories);
        args.timeout = timeout;
        args.abort = abortController;
        args.isFirst = false;
        recursivelyGetStories(args);
      }).catch(() => {
        args.isFirst = false;
        recursivelyGetStories(args);
      });
    }, isFirst ? 0 : 15000);
    args.timeout = timeout;
    args.abort = abortController;

    return () => {
      clearTimeout(args.timeout);
      args.abort?.abort();
    }
  }

  useEffect(() => {
    const unsubscribe = recursivelyGetStories();

    return () => {
      unsubscribe();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex flex-col overflow-hidden justify-between w-[100vw] h-[100vh] bg-black">
      <h1 className="flex justify-center items-center w-full p-6 bg-black flex-wrap text-white">Vcs ai!</h1>
      <div className="flex flex-col w-full justify-center items-center">
        {shownStory ? <img src={shownStory} alt="Story" height={900} width={500}  /> : (
          <div className="flex flex-col justify-center items-center w-full">
            <img src={'/qr-code-instagram.png'} alt="QR Code" height={500} width={500} /> 
            <p className="text-white text-center text-3xl">Escaneie o QR Code, siga a conta, ao postar um story eventualmente vc aparece aqui</p>
            <p className="text-white text-center text-3xl">(ou da algum problema)</p>
          </div>
        )}
      </div>
      <footer className="flex justify-center items-center w-full p-6 bg-black flex-wrap text-white">
        Feito com ❤️ por <span className="font-bold ml-1 mr-1 text-white">Nicolas</span> e
        <span className="font-bold ml-1 mr-1 text-white">Viviane</span> (principalmente ele
        e ela mandando 😂)
      </footer>
    </main>
  )
}