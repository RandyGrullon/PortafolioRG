import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function App({ Component, pageProps }) {
  return (
    <div className="bg-gray-900 h-screen">
      <Component {...pageProps} />;
    </div>
  );
}
``;
