import { Route, useNavigate, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Header from "../components/Header";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Home from "../pages/Home";
import Newpost from "../components/Newpost";
import Editposts from "../components/Editposts";
import Postpage from "../components/Postpage";
import About from "../pages/About";
import Missing from "../components/Missing";
import { format } from 'date-fns'
import api from '../api/posts'
import useWindowSize from "../hooks/Usewindowsize";
import useAxiosFetch from "../hooks/useAxiosFetch";

function App() {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const { data, isLoading, fetchError } = useAxiosFetch('https://react-backend-blog-project.herokuapp.com/posts');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(data);
  }, [data]);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await api.get('/posts');
  //       setPosts(response.data)
  //     } catch (err) {
  //       if (err.response) {
  //         // not in 200 response range
  //         console.log(err.response.data);
  //         console.log(err.response.status);
  //         console.log(err.response.headers);
  //       } else {
  //         console.log(`Error: ${err.message}`);
  //       }
  //     }
  //   }

  //   fetchPosts();

  // }, []);


  useEffect(() => {
    const fiteredResults = posts.filter(post => ((post.body).toLowerCase()).includes(search.toLowerCase()) || ((post.title).toLowerCase()).includes(search.toLowerCase()));
    setSearchResults(fiteredResults.reverse());

  }, [posts, search])


  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody }
    try {
      const response = await api.post('/posts', newPost);
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate("/")
    } catch (err) {
      console.log(`Error: ${err.message}`)
    }

  }

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody }
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(posts.map(post => post.id === id ? { ...response.data } : post));
      setEditTitle('');
      setEditBody('');
      navigate("/");
    } catch (err) {
      console.log(`Error: ${err.message}`)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      const postsList = posts.filter(post => post.id !== id);
      setPosts(postsList);
      navigate("/");
    } catch (err) {
      console.log(`Error: ${err.message}`)
    }

  }

  return (
    <div className="App">
      <Header title={"React JS Blog"} width={width} />
      <Nav search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home posts={searchResults} fetchError={fetchError} isLoading={isLoading} />} />
        <Route path="/post" element=
          {
            <Newpost
              handleSubmit={handleSubmit}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody}
            />
          }
        />
        <Route path="/edit/:id" element=
          {
            <Editposts
              posts={posts}
              handleEdit={handleEdit}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editBody={editBody}
              setEditBody={setEditBody}
            />
          }
        />
        <Route path="/post/:id" element={<Postpage posts={posts} handleDelete={handleDelete} />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />

    </div>
  );
}

export default App;
