import { useState, useEffect } from "react";
import "components/Redirect.css";

export default function Redirect({
  path,
  delaySeconds,
  title,
  message,
  callback,
}: {
  path: string;
  delaySeconds: number;
  title: string;
  message: string;
  callback?: () => void;
}) {
  const [remainingSec, setremainingSec] = useState(delaySeconds);
  useEffect(() => {
    setTimeout(() => {
      setremainingSec(remainingSec - 1 > 0 ? remainingSec - 1 : 0);
    }, 1000);

    if (remainingSec <= 0) {
      window.location.href = path;
      if (callback) {
        callback();
      }
    }

    // eslint-disable-next-line
  }, [remainingSec]);

  return (
    <div className="redirect-wrap">
      <h3>{title}</h3>
      <p>{message}</p>
      <p>Redirect to homepage after {remainingSec} seconds.</p>
    </div>
  );
}
