import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex-col mt-32 h-screen">
      <h1 className="flex justify-center text-3xl font-bold">I haven't made a homepage yet</h1>
      <p className="flex justify-center text-xl">Who cares about homepage anyways?</p>
      <div className="flex justify-center mt-4">
        <Link to="/posts" className="btn btn-primary">Explore posts</Link>
      </div>
    </div>
  );
};

export default HomePage;