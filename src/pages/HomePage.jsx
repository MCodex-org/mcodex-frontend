import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-4" style={{ height: 'calc(100vh - 64px)' }}>
      <h1 className="flex justify-center text-3xl font-bold">
        Share & Discover Builds
      </h1>
      <p className="flex justify-center text-xl mt-4">Discover and share Minecraft schematics in one simple, <br /> organized archive built for the community.</p>
      <div className="flex justify-center mt-8">
        <Link to="/posts" className="btn btn-primary">Explore posts</Link>
      </div>
    </div>
  );
};

export default HomePage;