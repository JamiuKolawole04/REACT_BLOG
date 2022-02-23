import axios from 'axios';

export default axios.create({
    baseURL: 'https://react-backend-blog-project.herokuapp.com'
})