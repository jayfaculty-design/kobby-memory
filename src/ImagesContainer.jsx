import React, { createContext, useContext, useEffect, useState } from "react";
import md5 from "crypto-js/md5";
import { GameContext } from "./GameContext";
import useSound from "use-sound";

function ImagesContainer() {
  const { score, highScore } = useContext(GameContext);
  const [scoreValue, setScoreValue] = score;
  const [highScoreValue, setHighScoreValue] = highScore;

  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clickedId, setClickedId] = useState(null);
  const [cachedImages, setCachedImages] = useState([]);
  const [triggerRefresh, setTriggerRefresh] = useState(0); //trigger to fetch new images

  const [playActive] = useSound("/audio/click.wav", {
    volume: 0.3,
  });
  const [gaveOver] = useSound("/audio/over.wav", {
    volume: 0.3,
  });

  const URL = "https://gateway.marvel.com/v1/public/characters";
  const publicKey = "3f2e75e483d48c3f502cb100dd2bef52";
  const privateKey = "3c7bfefb4d3f558a07ec37356b70785bd6882e82";

  function handleImage(id) {
    if (id === clickedId) {
      if (scoreValue > highScoreValue) {
        setHighScoreValue(scoreValue);
      }
      setScoreValue(0);
      console.log("Resetted");
    } else {
      setScoreValue((prevScore) => prevScore + 1);
      console.log("Increased");
      setClickedId(id);
    }
    // fetchImages();
    setTriggerRefresh((prev) => prev + 1);
  }

  const fetchImages = async () => {
    try {
      if (cachedImages.length > 0 && triggerRefresh === 0) {
        setImage(cachedImages);
        setLoading(false);
        return;
      }
      const timestamp = new Date().getTime();
      const hash = md5(timestamp + privateKey + publicKey).toString();

      const randomOffset = Math.floor(Math.random() * 50);
      const response = await fetch(
        `${URL}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}&limit=15&offset=${randomOffset}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Marvel Data");
      }

      const data = await response.json();

      // filtering out images withe placeholder images
      const filteredImages = data.data.results.filter(
        (images) =>
          images.thumbnail &&
          !images.thumbnail.path.includes("image_not_available")
      );

      setImage(filteredImages.slice(0, 12));
      setCachedImages(filteredImages.slice(0, 12));
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Failed to fectch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [triggerRefresh]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-[50px] text-white z-[999]">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-[50px] text-white z-[999]">{error}</p>
      </div>
    );
  return (
    <>
      <div className="pl-5 pr-5 pb-5">
        <div className="flex flex-wrap gap-5 justify-center">
          {image.map((images) => (
            <div
              className="image-card bg-gradient-to-r from-amber-900 to-stone-800 w-fit pl-1 pr-1 pt-1 pb-7 rounded-lg mt-10 cursor-pointer"
              key={images.id}
              onClick={() => handleImage(images.id)}
              onMouseDown={images.id === clickedId ? gaveOver : playActive}
            >
              <img
                src={`${images.thumbnail.path}.${images.thumbnail.extension}`}
                alt={images.name}
                className="w-[250px] h-[250px] rounded-lg"
                loading="lazy"
              />
              <p className="text-blue-100 text-[20px] relative mt-5 text-center">
                {images.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ImagesContainer;
