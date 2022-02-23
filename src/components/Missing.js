import { Link } from 'react-router-dom';

function Missing() {
    return (
        <main className='Missing'>
            <h2>Page Not Found</h2>
            <p>Well, that's disapponting.</p>
            <p>
                <Link to='/'>Visit our Homepage</Link>
            </p>
        </main>
    );
}

export default Missing;
