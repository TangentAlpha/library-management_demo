import {useState, type SubmitEvent} from 'react'
import './App.css'

type Book = { Title: string; Author: string; Publisher: string; Year: number }

function App() {
    const [token, setToken] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [title, setTitle] = useState('')
    const [books, setBooks] = useState<Book[]>([])
    const [count, setCount] = useState(0)
    const [busy, setBusy] = useState(false)
    const [searched, setSearched] = useState(false)
    const [error, setError] = useState('')

    async function signIn(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setBusy(true);
        setError('')
        try {
            const response = await fetch('/BookManagementService/login', {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({Username: username, Password: password}),
            })
            if (!response.ok) throw new Error('Sign-in failed. Check your credentials and try again.')
            const data = await response.json()
            if (typeof data.Token !== 'string' || !data.Token) throw new Error('The server returned an invalid sign-in response.')
            setToken(data.Token);
            setUsername('')
        } catch {
            setError('Unable to sign in. Check your credentials and that the API is running.')
        } finally {
            setPassword('');
            setBusy(false)
        }
    }

    async function search(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setBusy(true);
        setError('');
        setSearched(false);
        setBooks([])
        try {
            const query = new URLSearchParams({title: title.trim(), token})
            const response = await fetch(`/BookManagementService/books?${query}`, {cache: 'no-store'})
            if (response.status === 204) {
                setCount(0);
                setSearched(true);
                return
            }
            if (!response.ok) throw new Error(response.status === 401 || response.status === 403
                ? 'Your session is invalid. Reload the page and sign in again.' : 'Search failed. Please try again.')
            const data = await response.json()
            if (typeof data.FoundBooks !== 'number' || !Array.isArray(data.Results)) throw new Error('The server returned an invalid search response.')
            setBooks(data.Results);
            setCount(data.FoundBooks);
            setSearched(true)
        } catch (failure) {
            setError(failure instanceof TypeError ? 'Cannot reach the API. Check that it is running.' : failure instanceof Error ? failure.message : 'Search failed.')
        } finally {
            setBusy(false)
        }
    }

    return <main>
        <header><p className="eyebrow">LIBRARY CATALOGUE</p><h1>Find your next book</h1><p>Search the collection by
            title.</p></header>
        {!token ?
            <section><h2>Sign in</h2><p>Sign in to browse the library collection.</p>
                <form onSubmit={signIn}>
                    <label htmlFor="username">Username</label>
                    <input id="username" autoComplete="off" required
                           value={username}
                           onChange={e => setUsername(e.target.value)}
                           disabled={busy}/>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" autoComplete="off"
                           required value={password}
                           onChange={e => setPassword(e.target.value)}
                           disabled={busy}/>
                    <button disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
                </form>
            </section> :
            <section><h2>Search books</h2>
                <form onSubmit={search}>
                    <label htmlFor="title">Book title</label>
                    <div className="search"><input id="title" required value={title}
                                                   onChange={e => setTitle(e.target.value)} disabled={busy}
                                                   placeholder="Enter all or part of a title"/>
                        <button disabled={busy || !title.trim()}>{busy ? 'Searching...' : 'Search'}</button>
                    </div>
                </form>
                <div role="status" aria-live="polite">{busy ? <p>Searching the collection...</p> : searched &&
                    <p>{count === 0 || books.length === 0 ? 'No books found. Try another title.' : `${count} book${count === 1 ? '' : 's'} found`}</p>}</div>
                {books.length > 0 && <div className="table-wrap">
                    <table>
                        <caption>Search results</caption>
                        <thead>
                        <tr>{['Title', 'Author', 'Publisher', 'Year'].map(name => <th scope="col"
                                                                                      key={name}>{name}</th>)}</tr>
                        </thead>
                        <tbody>{books.map((book, index) => <tr key={index}>
                            <td>{book.Title}</td>
                            <td>{book.Author}</td>
                            <td>{book.Publisher}</td>
                            <td>{book.Year}</td>
                        </tr>)}</tbody>
                    </table>
                </div>}
            </section>
        }
        {error && <p role="alert" className="error">{error}</p>}
    </main>
}

export default App
